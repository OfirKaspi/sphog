interface VideoContainerProps {
  src: string;
  title: string;
  isPortrait: boolean;
}

const VideoContainer = ({ src, title, isPortrait }: VideoContainerProps) => {
  return (
    <div
      className={`w-full mx-auto ${isPortrait
          ? "aspect-[9/16] max-w-xs"
          : "aspect-[16/9] max-w-2xl"
        } rounded-lg overflow-hidden shadow-lg`}
    >
      <iframe
        className="w-full h-full"
        src={src}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoContainer;
