<template>
    <div class="loader">
        <div class="sr-only">Cargando...</div>
    </div>
</template>

<style scoped>
.loader {
    width: 50px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 8px solid #ddd;
    border-right-color: #666;
    animation: l2 1s infinite linear;
}

@keyframes l2 {
    to {
        transform: rotate(1turn);
    }
}
</style>