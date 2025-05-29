import { Card } from "../Card";

const projects = [
	{
		title: "Mi App de Tareas",
		image: "/images/tasks.png",
		description: "App con login, Firebase y CRUD.",
		tech: ["React", "Firebase", "Next.js"]
	},
	// ...
];

export default function ProjectsSection() {
	return (
		<section id="projects" className="projects">
			<h2>Proyectos</h2>
			<div className="card-grid">
				{projects.map((p) => (
					<Card key={p.title} title={p.title} image={p.image} description={p.description} footer={p.tech.join(", ")} /> // poner techs en batches
				))}
			</div>
		</section>
	);
}
