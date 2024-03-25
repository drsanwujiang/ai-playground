import { Switch as _Switch } from '@headlessui/react'

export default function Switch({
    className,
    name,
    description,
    selected,
    setSelected,
}: Readonly<{
    className?: string;
    name?: string;
    description?: string;
    selected: boolean;
    setSelected: (selected: boolean) => void;
}>) {
    return (
        <div className={`grid grid-cols-1 gap-2 ${className}`}>
            {name && <span className="text-gray-300">{name}</span>}
            {description && <span className="text-gray-500 text-sm">{description}</span>}
            <_Switch
                className={`${selected ? "bg-sky-600" : "bg-gray-500"} relative inline-flex h-[24px] w-[56px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 ${className}`}
                checked={selected}
                onChange={setSelected}
            >
                <span
                    aria-hidden="true"
                    className={`${selected ? "translate-x-8 bg-blue-300" : "translate-x-0 bg-gray-300"} pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
            </_Switch>
        </div>
    );
}