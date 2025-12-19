"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  toggleProfilePublic,
  updateUserBio,
  generateUserBio,
  batchUpdateProjectVisibility,
  updateProjectDescription,
  generateAIDescription,
} from "@/app/actions";
import {
  IdentitySection,
  FeaturedSection,
  LibrarySection,
  SaveButton,
} from "@/components/editor";
import type { Project, User } from "@prisma/client";

const ITEMS_PER_PAGE = 9;

type EditorUser = Pick<User, "username" | "bio" | "isPublic">;

interface EditorWorkbenchProps {
  user: EditorUser;
  projects?: Project[];
}

export function EditorWorkbench({ user, projects = [] }: EditorWorkbenchProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isBioGenerating, setIsBioGenerating] = useState(false);

  const initialBio = user?.bio || "";
  const [bio, setBio] = useState(initialBio);
  const [isPublic, setIsPublic] = useState(user?.isPublic || false);

  const initialFeaturedIds = projects
    .filter((p) => !p.isHidden)
    .slice(0, 6)
    .map((p) => p.id) as string[];

  const [featuredIds, setFeaturedIds] = useState<string[]>(initialFeaturedIds);
  const [descriptionChanges, setDescriptionChanges] = useState<Map<string, string>>(
    new Map()
  );
  const [rewritingProjectId, setRewritingProjectId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [libraryPage, setLibraryPage] = useState(1);

  const handleToggleRepo = (repo: Project) => {
    if (featuredIds.includes(repo.id)) {
      setFeaturedIds((prev) => prev.filter((id: string) => id !== repo.id));
    } else {
      if (featuredIds.length >= 6) return;
      setFeaturedIds((prev) => [...prev, repo.id]);
    }
  };

  const handleUpdateDesc = (id: string, newDesc: string) => {
    setDescriptionChanges((prev) => {
      const updated = new Map(prev);
      updated.set(id, newDesc);
      return updated;
    });
  };

  const handleRewrite = async (projectId: string) => {
    setRewritingProjectId(projectId);
    try {
      const result = await generateAIDescription(projectId);
      if (result.success && result.description) {
        setDescriptionChanges((prev) => {
          const updated = new Map(prev);
          updated.set(projectId, result.description);
          return updated;
        });
        toast.success("Description rewritten successfully!");
      }
    } catch (error) {
      console.error("Failed to generate AI description:", error);
      toast.error("Failed to generate description. Please try again.");
    } finally {
      setRewritingProjectId(null);
    }
  };

  const handleTogglePublic = async (checked: boolean) => {
    setIsPublic(checked);
    try {
      await toggleProfilePublic(checked);
      toast.success(checked ? "Profile is now public!" : "Profile is now private!");
    } catch (error) {
      console.error("Failed to toggle public status:", error);
      setIsPublic(!checked);
      toast.error("Failed to update profile visibility. Please try again.");
    }
  };

  const handleGenerateBio = async () => {
    setIsBioGenerating(true);
    try {
      const result = await generateUserBio();
      if (result.success && result.bio) {
        setBio(result.bio);
        toast.success("Bio generated successfully!");
      }
    } catch (error) {
      console.error("Failed to generate bio:", error);
      toast.error("Failed to generate bio. Please try again.");
    } finally {
      setIsBioGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const savePromise = (async () => {
      try {
        if (bio !== initialBio) {
          await updateUserBio(bio);
        }

        const allProjectIds = projects.map((p) => p.id) as string[];
        const hiddenProjectIds = allProjectIds.filter(
          (id) => !featuredIds.includes(id)
        );

        if (hiddenProjectIds.length > 0 || featuredIds.length > 0) {
          await batchUpdateProjectVisibility(hiddenProjectIds, featuredIds);
        }

        for (const [projectId, description] of descriptionChanges.entries()) {
          await updateProjectDescription(projectId, description);
        }

        setDescriptionChanges(new Map());
      } catch (error) {
        console.error("Failed to save changes:", error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    })();

    toast.promise(savePromise, {
      loading: "Saving changes...",
      success: "All changes saved successfully!",
      error: "Failed to save some changes. Please try again.",
    });
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setLibraryPage(1);
  };

  const featuredRepos = useMemo(
    () => projects.filter((p) => featuredIds.includes(p.id)),
    [projects, featuredIds]
  );

  const availableRepos = useMemo(
    () =>
      projects
        .filter((p) => !featuredIds.includes(p.id))
        .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [projects, featuredIds, searchTerm]
  );

  const totalPages = Math.ceil(availableRepos.length / ITEMS_PER_PAGE);
  const paginatedRepos = useMemo(
    () =>
      availableRepos.slice(
        (libraryPage - 1) * ITEMS_PER_PAGE,
        libraryPage * ITEMS_PER_PAGE
      ),
    [availableRepos, libraryPage]
  );

  return (
    <div className="w-full h-full space-y-12 pb-32">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        <IdentitySection
          username={user.username || "unknown"}
          isPublic={isPublic}
          bio={bio}
          isBioGenerating={isBioGenerating}
          onPublicToggle={handleTogglePublic}
          onBioChange={setBio}
          onGenerateBio={handleGenerateBio}
        />

        <div className="space-y-8">
          <div className="flex justify-between items-end border-b border-border pb-4">
            <div>
              <h2 className="font-serif text-2xl">Portfolio</h2>
              <p className="text-sm text-muted-foreground">
                Curate your best work.
              </p>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {projects.length} Repositories Found
            </span>
          </div>

          <div className="space-y-12 relative">
            <FeaturedSection
              featuredRepos={featuredRepos}
              featuredCount={featuredIds.length}
              descriptionChanges={descriptionChanges}
              rewritingProjectId={rewritingProjectId}
              onToggle={handleToggleRepo}
              onUpdateDesc={handleUpdateDesc}
              onRewrite={handleRewrite}
            />

            <LibrarySection
              availableRepos={availableRepos}
              paginatedRepos={paginatedRepos}
              totalProjects={projects.length}
              searchTerm={searchTerm}
              libraryPage={libraryPage}
              totalPages={totalPages}
              onSearchChange={handleSearchChange}
              onPageChange={setLibraryPage}
              onToggle={handleToggleRepo}
            />
          </div>
        </div>
      </div>

      <SaveButton isSaving={isSaving} onSave={handleSave} />
    </div>
  );
}
