import { AboutSection } from '../../components/AboutSection';
import { ContactSection } from '../../components/ContactSection';
import { HeroSection } from '../../components/HeroSection';
import { ProjectsSection } from '../../components/ProjectsSection';
import './Home.css';

const Home = ({ }) => {
	return (
		<div className='home'>
			<HeroSection />
			<ProjectsSection />
			<AboutSection />
			<ContactSection />
		</div>
	);
};

export default Home;