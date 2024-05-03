export const audios = {
    pokemon_selected: new Audio("audios/Pokemon_selection.mp3"),
};

export const playAudio = (audio) => {
    audio.currentTime = 0;
    audio.play();
};