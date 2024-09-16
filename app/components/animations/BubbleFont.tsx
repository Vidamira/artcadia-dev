import React, { useEffect } from "react";

const BubbleFont = () => {
  return (
    <div className="flex">
      <BubbleText />
    </div>
  );
};

const BubbleText = () => {
  useEffect(() => {
    const spans = document.querySelectorAll(
      ".hover-text span"
    ) as NodeListOf<HTMLSpanElement>;

    spans.forEach((span) => {
      span.addEventListener("mouseenter", function (this: typeof span) {
        this.style.fontWeight = "100";
        this.style.color = "#eef2ff";

        const leftNeighbor = this.previousElementSibling as HTMLSpanElement;
        const rightNeighbor = this.nextElementSibling as HTMLSpanElement;
        
        if (leftNeighbor) {
          leftNeighbor.style.fontWeight = "500";
          leftNeighbor.style.color = "#f53d0f22";
        }
        if (rightNeighbor) {
          rightNeighbor.style.fontWeight = "500";
          rightNeighbor.style.color = "#f53d0f22";
        }
      });

      span.addEventListener("mouseleave", function (this: typeof span) {
        this.style.fontWeight = "300";
        this.style.color = "#BB4745";

        const leftNeighbor = this.previousElementSibling as HTMLSpanElement;
        const rightNeighbor = this.nextElementSibling as HTMLSpanElement;

        if (leftNeighbor) {
          leftNeighbor.style.fontWeight = "300";
          leftNeighbor.style.color = "#f53d0f22";
        }

        if (rightNeighbor) {
          rightNeighbor.style.fontWeight = "300";
          rightNeighbor.style.color = "#f53d0f22";
        }
      });
    });
  }, []);

  return (
    <h2 className="hover-text text-left text-3xl md:text-6xl font-light text-zinc-100 contain:layout">
      <Text>DISCOVER YOUR PERFECT PIECE</Text>
    </h2>
  );
};

const Text = ({ children }: { children: string }) => {
  return (
    <>
      {children.split("").map((child, idx) => (
        <span
          style={{
            transition: "0.35s font-weight, 0.35s color",
          }}
          key={idx}
        >
          {child}
        </span>
      ))}
    </>
  );
};

export default BubbleFont;
