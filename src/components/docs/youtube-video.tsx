interface YoutubeVideoProps {
  url: string;
  width?: number;
  height?: number;
}

/**
 * YoutubeVideo component
 *
 * How to get the URL of the YouTube video?
 * 1. Go to the YouTube video you want to embed
 * 2. Click on the share button and copy the embed URL
 * 3. Paste the URL into the url prop
 *
 * @param {string} url - The URL of the YouTube video
 * @param {number} width - The width of the video
 * @param {number} height - The height of the video
 */
export const YoutubeVideo = ({
  url,
  width = 560,
  height = 315,
}: YoutubeVideoProps) => {
  return (
    <div className="my-4">
      <iframe
        width={width}
        height={height}
        src={url}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="w-full aspect-video"
      />
    </div>
  );
};
