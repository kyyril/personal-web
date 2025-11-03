import ListProject from "./ListProject";
import { projects } from "../../lib/data";

export default function ProjectListWrapper() {
  return <ListProject projects={projects} />;
}
