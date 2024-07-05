export default function Slider({
                                 className,
                                 name,
                                 description,
                                 min,
                                 max,
                                 step,
                                 value,
                                 setValue,
                               }: Readonly<{
  className?: string;
  name?: string;
  description?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  setValue: (value: number) => void;
}>) {
  return (
    <div className={`grid grid-cols-1 gap-2 ${className}`}>
      {name && <span className="text-gray-300">{name}</span>}
      {description && <span className="text-gray-500 text-sm">{description}</span>}
      <div className="flex flex-row items-center gap-4">
        <input
          type="range"
          className="transparent h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-600"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => setValue(Number(e.target.value))}
        />
        <span className="min-w-8 text-right">{value}</span>
      </div>
    </div>
  );
}