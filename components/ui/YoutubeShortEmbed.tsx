interface YoutubeShortEmbedProps {
  videoId: string;
  title: string;
}

export default function YoutubeShortEmbed({ videoId, title }: YoutubeShortEmbedProps) {
  return (
    <div style={{ maxWidth: "360px", width: "100%", margin: "0 auto" }}>
      <div
        style={{
          position: "relative",
          paddingBottom: "177.78%", // 9:16
          height: 0,
          overflow: "hidden",
          borderRadius: "12px",
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
            borderRadius: "12px",
          }}
        />
      </div>
    </div>
  );
}
