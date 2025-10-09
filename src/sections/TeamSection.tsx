"use client";

import Image from "next/image";
import { useMemo, useState } from "react"; // Импортируем useMemo
import { motion } from "framer-motion";
import SlidingButton from "@/components/SlidingButton";
import { Employee } from "@prisma/client";
import { normalizeImagePath } from "@/lib/pathutils";
import { useTranslations } from "@/lib/localize";

interface TeamSectionProps {
    data?: Employee[];
}

// Логика сортировки
// Определяем иерархию ролей. Чем раньше роль, тем она выше в приоритете.
const ROLE_ORDER = [
    "Management",
    "DevOps",
    "Backend",
    "Frontend",
    "UI/UX",
    "Gamedev",
];

/**
 * Получает наивысший приоритет для сотрудника на основе его ролей.
 * @param employee - Объект сотрудника
 * @returns Числовой приоритет (меньше = выше).
 */
const getSortPriority = (employee: Employee): number => {
    if (!employee.role) {
        // Сотрудники без роли отправляются в конец списка
        return ROLE_ORDER.length;
    }
    const roles = employee.role.split(',').map(r => r.trim());
    let bestPriority = ROLE_ORDER.length;

    // Ищем самую приоритетную роль у сотрудника
    for (const role of roles) {
        const priority = ROLE_ORDER.indexOf(role);
        if (priority !== -1 && priority < bestPriority) {
            bestPriority = priority;
        }
    }
    return bestPriority;
};

export default function TeamSection({ data }: TeamSectionProps) {
    const t = useTranslations('TeamSection');
    const t_employees = useTranslations('employees');

    // Используем useMemo, чтобы сортировка выполнялась только один раз при изменении данных.
    const sortedData = useMemo(() => {
        const dataToSort = data ?? [];
        // Создаем копию массива, чтобы не мутировать исходный prop
        return [...dataToSort].sort((a, b) => {
            const priorityA = getSortPriority(a);
            const priorityB = getSortPriority(b);

            // Сначала сортируем по приоритету роли
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            // Если приоритеты равны, сортируем по ID для стабильности
            return a.id - b.id;
        });
    }, [data]);

    const allIndividualRoles = (sortedData ?? []).flatMap((employee) =>
        employee.role ? employee.role.split(',').map((role) => role.trim()) : []
    );

    const uniqueRoles = [...new Set(allIndividualRoles)].map(role => t(role));
    const filters = [t('allCategories'), ...uniqueRoles];

    const [selectedFilter, setSelectedFilter] = useState(filters[0]);
    const [showAll, setShowAll] = useState(false);

    const filteredData =
        selectedFilter === filters[0]
            ? sortedData // Используем отсортированные данные
            : sortedData?.filter((member) => { // Используем отсортированные данные
                if (!member.role) {
                    return false;
                }
                const memberRoles = member.role
                    .split(',')
                    .map((role) => t(role.trim()));
                return memberRoles.includes(selectedFilter);
            });

    const visibleData = showAll ? filteredData : filteredData?.slice(0, 8);

    return (
        <section className='container mx-auto px-4 py-12'>
            <div className='mx-auto max-w-[1200px] '>
                <h2 className='text-3xl font-bold mb-12 text-textPrimary'>{t('title')}</h2>

                <div className='flex flex-wrap gap-3 mb-10'>
                    {filters.map((label: string) => {
                        const isActive = selectedFilter === label;
                        return (
                            <div
                                key={label}
                                className='rounded-full p-[2px] bg-gradient-to-b from-[#58427C] to-[#77C3DD]'
                            >
                                <button
                                    onClick={() => {
                                        setSelectedFilter(label);
                                        setShowAll(false); // Reset to 8 when changing filter
                                    }}
                                    className={`px-5 py-2 text-sm rounded-full font-medium transition duration-200 ${
                                        isActive
                                            ? 'bg-[#58427C] text-white'
                                            : 'bg-white text-[#58427C] hover:bg-[#f4f4f4]'
                                    }`}
                                >
                                    {label}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {visibleData?.map((member, index) => (
                        <motion.div
                            key={index}
                            className='w-full flex justify-center'
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <div className='w-full max-w-[368px] h-[398px] bg-gradient-to-b from-[#58427C] to-[#77C3DD] p-[1.5px] rounded-xl shadow-md hover:shadow-xl transition-shadow'>
                                <div className='w-full h-full bg-[#F5F2FD] rounded-xl p-6 flex flex-col justify-start'>
                                    <div className='flex items-center gap-4 mb-4'>
                                        <div className='w-[100px] h-[100px] rounded-full overflow-hidden shrink-0'>
                                            <Image
                                                src={normalizeImagePath(
                                                    member?.imagePath as string | undefined,
                                                    '/uploads/employees/defaultAvatar.png'
                                                )}
                                                alt={`${t_employees(`employee_${member.nickname}_first_name`)} ${t_employees(`employee_${member.nickname}_last_name`)} photo`}
                                                width={100}
                                                height={100}
                                                className='object-contain'
                                            />
                                        </div>
                                        <div>
                                            <h3 className='text-lg font-bold text-textPrimary'>
                                                {t_employees(`employee_${member.nickname}_first_name`)} {t_employees(`employee_${member.nickname}_last_name`)}
                                            </h3>
                                            <p className='text-sm text-[#6C5D9E] font-semibold'>
                                                {/* ИЗМЕНЕНИЕ: Локализуем роли при отображении */}
                                                {member.role?.split(',').map(r => t(r.trim())).join(', ')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='text-sm text-gray-800 mb-4 leading-relaxed'>
                                        {t_employees(`employee_${member.nickname}_site_description`)}
                                    </div>

                                    <div className='mt-auto pt-2 text-xs text-[#6C5D9E] font-medium flex flex-wrap gap-2'>
                                        {member.nickname ? <span>@{member.nickname}</span> : ''}
                                        {member.tags?.split(' ').map((tag, i) => (
                                            <span key={i}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredData && filteredData.length > 8 && (
                    <div className='flex justify-center mt-12'>
                        {!showAll ? (
                            <SlidingButton
                                href='#'
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowAll(true);
                                }}
                            >
                                {t('button_more')}
                            </SlidingButton>
                        ) : (
                            <SlidingButton
                                href='#'
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowAll(false);
                                }}
                            >
                                {t('button_less')}
                            </SlidingButton>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}