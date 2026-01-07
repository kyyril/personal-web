import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

import ImagePreview from "../ImagePreview";

interface ProjectCarouselProps {
  images: string[];
}

export default function ProjectCarousel({ images }: ProjectCarouselProps) {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-muted-foreground">No images available.</p>
      </div>
    );
  }

  return (
    <Carousel>
      <CarouselContent>
        {images.map((img, index) => (
          <CarouselItem className="lg:basis-1/2" key={index}>
            <ImagePreview src={img} alt={`Project illustration ${index + 1}`}>
              <Image
                src={img}
                alt={`Project illustration ${index + 1}`}
                height={450}
                width={800}
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                className="rounded object-cover w-full h-auto aspect-video shadow-sm transition-all duration-300 group-hover:scale-[1.02]"
              />
            </ImagePreview>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-2 top-1/2" />
      <CarouselNext className="absolute right-2 top-1/2" />
    </Carousel>
  );
}
