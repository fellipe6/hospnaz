<script setup>
defineProps({
    label: String,
    value: String,
    variation: String,
    trend: String,
    icon: String,
    color: String,
    description: String
});

const getBgColor = (color) => {
    switch (color) {
        case 'blue': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-500';
        case 'green': return 'bg-green-100 dark:bg-green-900/20 text-green-500';
        case 'cyan': return 'bg-cyan-100 dark:bg-cyan-900/20 text-cyan-500';
        case 'orange': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-500';
        default: return 'bg-gray-100 text-gray-500';
    }
};

const getBorderColor = (color) => {
    switch (color) {
        case 'blue': return 'border-blue-500';
        case 'green': return 'border-green-500';
        case 'cyan': return 'border-cyan-500';
        case 'orange': return 'border-orange-500';
        default: return 'border-surface';
    }
};
</script>

<template>
    <div class="card p-4 shadow-sm border-l-4 h-full flex flex-col justify-between transition-transform hover:scale-105" :class="getBorderColor(color)">
        <div class="flex justify-between items-start mb-3">
            <div>
                <span class="block text-muted-color font-medium mb-1 uppercase text-xs tracking-wider">{{ label }}</span>
                <div class="text-3xl font-bold text-surface-900 dark:text-surface-0">{{ value }}</div>
            </div>
            <div class="flex items-center justify-center p-3 rounded-lg" :class="getBgColor(color)">
                <i :class="[icon, 'text-xl']"></i>
            </div>
        </div>
        <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
                <span :class="trend === 'up' ? 'text-green-500' : 'text-red-500'" class="font-bold flex items-center">
                    <i :class="trend === 'up' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="text-xs mr-1"></i>
                    {{ variation }}
                </span>
                <span class="text-muted-color text-sm">{{ description }}</span>
            </div>
        </div>
    </div>
</template>
