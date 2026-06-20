import { Suspense } from "react";
import { ProjectsLibrary } from "../_components/ProjectsLibrary";

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsLibrary />
    </Suspense>
  );
}
