import { myPlayer, usePlayersList } from "playroomkit"
import { POKEMON_MODELS } from "./Pokemon"

export const UI = () => {
    const me = myPlayer()
    usePlayersList(true);
    return (
      <>
        <div
            className={
            "fixed z-10 bottom-4 left-1/2 flex flex-wrap justify-center items-center gap-2.5 -translate-x-1/2 w-full max-w-[75vw]"
            }
        >
        {POKEMON_MODELS.map((model, idx) => (
          <div
            key={model}
            className={`min-w-14 min-h-14 w-14 h-14 bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-full shadow-md cursor-pointer
            ${
              me?.getState("pokemon") === model ||
              (!me?.getState("pokemon") && idx === 0)
                ? "ring-4 ring-blue-500"
                : ""
            }
            `}
            onClick={() => me?.setState("pokemon", model)}
          >
            <img
              src={`/images/pokemons/${model}.png`}
              alt={model}
              className="w-full h-full"
            />
          </div>
        ))}
        </div>
      </>
    );
};