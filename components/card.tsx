import Image from "next/image";

type CardProps = {
  title: string;
  subtitle: string;
  images?: string[];
  isActive?: boolean;
  description: string;
  onClick?: () => void;
};

export const Card = ({
  title,
  subtitle,
  images,
  description,
  onClick,
}: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`w-full flex flex-col justify-center gap-2 rounded-2xl border py-6 px-4 cursor-pointer transition duration-200 hover:border-foreground/50 group
      `}
    >
      <span className="text-sm text-card-foreground/50">{subtitle}</span>
      <p className="text-xl font-medium">{title}</p>
      {images && images.length > 0 && (
        <div className="relative flex justify-center items-center mt-6 h-32 mb-10">
          {images.map((src, idx) => (
            <div
              key={idx}
              className={`
              absolute transition-all duration-300
              ${
                idx === 1
                  ? "translate-x-6 translate-y-4 z-10 group-hover:rotate-10"
                  : "-translate-x-12 -translate-y-2 z-0 group-hover:-rotate-10"
              }
              w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28
            `}
            >
              <Image
                src={src}
                alt={`${title} image ${idx + 1}`}
                fill
                className="object-cover rounded-xl border border-foreground/20"
              />
            </div>
          ))}
        </div>
      )}
      <p>{description}</p>
    </div>
  );
};
