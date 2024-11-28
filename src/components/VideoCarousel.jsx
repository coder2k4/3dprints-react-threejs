import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { hightlightsSlides } from '../constants';
import { pauseImg, playImg, replayImg } from './../utils/index';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const VideoCarousel = () => {
	// Рефы для доступа к DOM элементам видео и индикаторов прогресса
	const videoRef = useRef([]);
	const videoSpanRef = useRef([]);
	const videoDivRef = useRef([]);

	// Состояние для управления воспроизведением видео
	const [video, setVideo] = useState({
		isEnd: false, // Флаг окончания текущего видео
		startPlay: false, // Флаг начала воспроизведения
		videoId: 0, // Индекс текущего видео
		isLastVideo: false, // Флаг последнего видео
		isPlaying: false, // Флаг воспроизведения/паузы
	});

	// Состояние для отслеживания загруженных видео
	const [loadedData, setLoadedData] = useState([]);
	const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

	// GSAP анимация для слайдера и автовоспроизведения
	useGSAP(() => {
		// Анимация перемещения слайдера
		gsap.to('#slider', {
			transform: `translateX(${-100 * videoId}%)`,
			duration: 2,
			ease: 'power2.inOut',
		});

		// Триггер для автовоспроизведения при скролле
		gsap.to('#video', {
			scrollTrigger: {
				trigger: '#video',
				toggleActions: 'restart none none none',
			},
			onComplete: () => {
				setVideo(pre => ({
					...pre,
					startPlay: true,
					isPlaying: true,
				}));
			},
		});
	}, [isEnd, videoId]);

	// Эффект для анимации индикатора прогресса
	useEffect(() => {
		let currentProgress = 0;
		let span = videoSpanRef.current;

		if (span[videoId]) {
			// Анимация прогресс-бара
			let anim = gsap.to(span[videoId], {
				onUpdate: () => {
					const progress = Math.ceil(anim.progress() * 100);

					if (progress != currentProgress) {
						currentProgress = progress;

						// Адаптивная ширина индикатора
						gsap.to(videoDivRef.current, {
							width:
								window.innerWidth < 760
									? '10vw'
									: window.innerWidth < 1200
									? '10vw'
									: '4vw',
						});

						// Анимация заполнения прогресс-бара
						gsap.to(span[videoId], {
							width: `${currentProgress}%`,
							backgroundColor: 'white',
						});
					}
				},
				onComplete: () => {
					if (isPlaying) {
						gsap.to(videoDivRef.current[videoId], {
							width: '12px',
						});
						gsap.to(span[videoId], {
							backgroundColor: '#afafaf',
						});
					}
				},
			});

			// Перезапуск анимации для первого видео
			if (videoId == 0) {
				anim.restart();
			}

			// Обновление прогресса анимации
			const animUpdate = () => {
				anim.progress(
					videoRef.current[videoId].currentTime /
						hightlightsSlides[videoId].videoDuration
				);
			};

			// Управление тикером GSAP
			if (isPlaying) gsap.ticker.add(animUpdate);
			else gsap.ticker.remove(animUpdate);
		}
	}, [isPlaying, videoId]);

	// Эффект для управления воспроизведением видео
	useEffect(() => {
		if (loadedData.length > 3) {
			if (!isPlaying) videoRef.current[videoId].pause();
			else startPlay && videoRef.current[videoId].play();
		}

		return () => {};
	}, [isPlaying, loadedData, startPlay, videoId]);

	// Обработчик событий видео
	const handleProcess = (type, i) => {
		switch (type) {
			case 'video-end': // Окончание видео
				setVideo(pre => ({ ...pre, isEnd: true, videoId: i + 1 }));
				break;

			case 'video-last': // Последнее видео
				setVideo(pre => ({ ...pre, isLastVideo: true }));
				break;

			case 'video-reset': // Сброс к началу
				setVideo(pre => ({ ...pre, videoId: 0, isLastVideo: false }));
				break;

			case 'pause': // Пауза
				setVideo(pre => ({ ...pre, isPlaying: !pre.isPlaying }));
				break;

			case 'play': // Воспроизведение
				setVideo(pre => ({ ...pre, isPlaying: !pre.isPlaying }));
				break;

			default:
				return video;
		}
	};

	// Обработчик загрузки метаданных видео
	const handleLoadedMetaData = (i, e) => setLoadedData(pre => [...pre, e]);

	return (
		<>
			{/* Контейнер слайдера */}
			<div className='flex items-center'>
				{hightlightsSlides.map((list, i) => (
					<div key={list.id} id='slider' className='sm:pr-20 pr-10'>
						<div className='video-carousel_container'>
							<div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
								<video
									id='video'
									playsInline={true}
									className={`${
										list.id === 2 && 'translate-x-44'
									} pointer-events-none`}
									preload='auto'
									muted
									ref={el => (videoRef.current[i] = el)}
									onEnded={() =>
										i !== 3
											? handleProcess('video-end', i)
											: handleProcess('video-last')
									}
									onPlay={() => setVideo(pre => ({ ...pre, isPlaying: true }))}
									onLoadedMetadata={e => handleLoadedMetaData(i, e)}
								>
									<source src={list.video} type='video/mp4' />
								</video>
							</div>

							{/* Текстовые оверлеи */}
							<div className='absolute top-12 left-[5%] z-10'>
								{list.textLists.map((text, i) => (
									<p key={i} className='md:text-2xl text-xl font-medium'>
										{text}
									</p>
								))}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Контролы и индикаторы прогресса */}
			<div className='relative flex-center mt-10'>
				<div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
					{videoRef.current.map((_, i) => (
						<span
							key={i}
							className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer'
							ref={el => (videoDivRef.current[i] = el)}
						>
							<span
								className='absolute h-full w-full rounded-full'
								ref={el => (videoSpanRef.current[i] = el)}
							/>
						</span>
					))}
				</div>

				{/* Кнопка управления воспроизведением */}
				<button className='control-btn'>
					<img
						src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
						alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'}
						onClick={
							isLastVideo
								? () => handleProcess('video-reset')
								: !isPlaying
								? () => handleProcess('play')
								: () => handleProcess('pause')
						}
					/>
				</button>
			</div>
		</>
	);
};

export default VideoCarousel;
