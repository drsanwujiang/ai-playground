import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { RiExpandUpDownLine } from '@remixicon/react'

export type SelectItem = {
    content: string;
    value: string;
    [x: string]: any;
};

export default function Select({
    className,
    name,
    description,
    items,
    value,
    setValue,
}: Readonly<{
    className?: string;
    name?: string;
    description?: string;
    items: SelectItem[];
    value: SelectItem;
    setValue: (value: SelectItem) => void;
}>) {
    return (
        <div className={`grid grid-cols-1 gap-2 ${className}`}>
            {name && <span className="text-gray-300">{name}</span>}
            {description && <span className="text-gray-500 text-sm">{description}</span>}
            <Listbox value={value} onChange={setValue}>
                <div className="relative">
                    <Listbox.Button
                        className="relative w-full cursor-default border rounded-lg bg-neutral-900 py-2 pl-4 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate">
                            {value.content}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <RiExpandUpDownLine className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options
                            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {items.map((item, index) => (
                                <Listbox.Option
                                    key={index}
                                    className={({active}) => `relative cursor-default select-none py-2 px-4 ${active && "bg-neutral-800"}`}
                                    value={item}
                                >
                                    {item.content}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
}