/*************  ✨ Codeium Command 🌟  *************/
feat: Add Highlights component with GSAP animations
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { rightImg, watchImg } from './../utils/index';
import VideoCarousel from './VideoCarousel';

- Implemented Highlights component using GSAP for animations.
- Added animations for title and links with staggered effect.
- Integrated VideoCarousel component within the Highlights section.
- Utilized images from utils for visual elements in links.
const Highlights = () => {
	useGSAP(() => {
		gsap.to('#title', { opacity: 1, y: 0 });
		gsap.to('.link', { opacity: 1, y: 0, duration: 1, stagger: 0.25 });
	}, []);

	return (
		<section
			id='highlights'
			className='w-screen overflow-hidden h-full common-padding bg-zinc'
		>
			<div className='screen-max-width'>
				<div className='mb-12 w-full md:flex items-end justify-between'>
					<h1 id='title' className='section-heading'>
						Get the headlights
					</h1>
					<div className='flex flex-wrap items-end gap-5'>
						<p className='link'>
							Watch the film
							<img src={watchImg} alt='watch' className='ml-2' />
						</p>
						<p className='link'>
							Watch the event
							<img src={rightImg} alt='right' className='ml-2' />
						</p>
					</div>
				</div>
				<VideoCarousel />
			</div>
		</section>
	);
};

export default Highlights;

/******  8f778f04-be23-4125-a7d2-1e583d02477d  *******/