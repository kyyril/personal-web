export default function VideoEmbed() {
  return (
    <div>
      <h1>Embedded YouTube Video</h1>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/EysBsw290LE?si=0uVJK1AEZmjHBlzF"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
}
