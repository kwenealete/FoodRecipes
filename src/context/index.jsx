import { createContext, useState } from "react";
import { useNavigate } from "react-router";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeList, setRecipeList] = useState([]);
  const [recipeDetailsData, setRecipeDetailsData] = useState(null);
  const [favoritesList, setFavoritesList] = useState([]);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchParam}`
      );
      const data = await res.json();
      if (data?.data?.recipes) {
        setRecipeList(data?.data?.recipes);
        setLoading(false);
        setSearchParam("");
        navigate("/");
      }
    } catch (e) {
      setLoading(false);
      setSearchParam("");
      console.log(e);
    }
  }

  function handleAddToFavorite(getCurrentItem) {
    console.log(getCurrentItem);
    let cpyFavoritesLists = [...favoritesList];
    const index = cpyFavoritesLists.findIndex(
      item => item.id === getCurrentItem.id
    );

    if (index === -1) {
      cpyFavoritesLists.push(getCurrentItem);
    } else {
      cpyFavoritesLists.splice(index);
    }

    setFavoritesList(cpyFavoritesLists);
  }
  console.log("favorites list", favoritesList);

  return (
    <GlobalContext.Provider
      value={{
        searchParam,
        loading,
        recipeList,
        setSearchParam,
        handleSubmit,
        recipeDetailsData,
        setRecipeDetailsData,
        favoritesList,
        handleAddToFavorite
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
