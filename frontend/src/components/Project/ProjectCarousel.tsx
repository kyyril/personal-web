import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

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
            <Image
              src={img}
              alt={`Image ${index + 1}`}
              height={200}
              width={500}
              loading="lazy"
              quality={100}
              className="rounded-sm"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-2 top-1/2" />
      <CarouselNext className="absolute right-2 top-1/2" />
    </Carousel>
  );
}
