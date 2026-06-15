"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import FilterTable from "@/components/FilterTable";

export default function FiltersPage() {

  const [showForm, setShowForm] =
    useState(false);

  const [filters, setFilters]: any =
    useState([]);

  const [filterName, setFilterName] =
    useState("");

  const [editFilter, setEditFilter]: any =
    useState(null);

  const [editFilterName, setEditFilterName] =
    useState("");

    const [currentUser, setCurrentUser]: any =
  useState(null);

  // FETCH FILTERS

  const fetchFilters =
  async (
    userId: number
  ) => {

    try {

      const response =
        await fetch(

          `/api/filters?user_id=${userId}`,

          {
            cache:
              "no-store",
          }

        );

      const data =
        await response.json();

      if (data.success) {

        setFilters(
          [...data.filters]
        );

      }

    } catch (error) {

      console.log(error);

    }

};

  useEffect(() => {

  const storedUser =
    localStorage.getItem(
      "user"
    );

  if (storedUser) {

    const parsedUser =
      JSON.parse(
        storedUser
      );

    setCurrentUser(
      parsedUser
    );

    fetchFilters(
      parsedUser.id
    );

  }

}, []);
  // CREATE FILTER

  const handleCreateFilter =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        const response =
          await fetch(

            "/api/filters",

            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                user_id:
  currentUser?.id,

                filter_name:
                  filterName,

              }),

            }

          );

        const data =
          await response.json();

        if (data.success) {

          toast.success(
            data.message
          );

          if (data.filter) {

            setFilters(
              (prev: any) => [
                data.filter,
                ...prev,
              ]
            );

          } else if (currentUser?.id) {

            fetchFilters(
              currentUser.id
            );

          }

          setShowForm(false);

          setFilterName("");

        } else {

          toast.error(
            data.message
          );

        }

      } catch (error) {

        toast.error(
          "Something went wrong"
        );

      }

    };

  // UPDATE FILTER

  const handleUpdateFilter =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        const response =
          await fetch(

            `/api/filters/${editFilter.id}`,

            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                filter_name:
                  editFilterName,

              }),

            }

          );

        const data =
          await response.json();

        if (data.success) {

          toast.success(
            data.message
          );

          if (data.filter) {

            setFilters(
              (prev: any) =>
                prev.map(
                  (filter: any) =>
                    filter.id ===
                    data.filter.id
                      ? data.filter
                      : filter
                )
            );

          } else if (currentUser?.id) {

            fetchFilters(
              currentUser.id
            );

          }

          setEditFilter(null);

          setEditFilterName("");

        } else {

          toast.error(
            data.message
          );

        }

      } catch (error) {

        toast.error(
          "Something went wrong"
        );

      }

    };

  return (

    <div className="p-2">

      

      <div className="flex items-center justify-between mb-6">

        <h1 className="text-3xl font-bold text-black">

          Filters 

        </h1>

        <button
          onClick={() =>
            setShowForm(true)
          }
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
        >

          Add Filter

        </button>

      </div>

      {/* TABLE */}

      <FilterTable

        filters={filters}

        setFilters={setFilters}

        setEditFilter={setEditFilter}

        setEditFilterName={setEditFilterName}

      />

      {/* ADD FILTER MODAL */}

      {showForm && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white w-[400px] rounded-2xl p-6 shadow-2xl">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-2xl font-bold text-black">

                Add Filter

              </h2>

              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="text-gray-500 text-xl"
              >

                ✕

              </button>

            </div>

            <form
              onSubmit={handleCreateFilter}
              className="space-y-4"
            >

              <input
                type="text"
                placeholder="Filter Name"
                value={filterName}
                onChange={(e) =>
                  setFilterName(
                    e.target.value
                  )
                }
                className="w-full border p-3 rounded-lg text-black"
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg"
              >

                Create Filter

              </button>

            </form>

          </div>

        </div>

      )}

       {/* EDIT FILTER MODAL  */}

      {editFilter && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white w-[400px] rounded-2xl p-6 shadow-2xl">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-2xl font-bold text-black">

                Edit Filter

              </h2>

              <button
                onClick={() =>
                  setEditFilter(null)
                }
                className="text-gray-500 text-xl"
              >

                ✕

              </button>

            </div>

            <form
              onSubmit={handleUpdateFilter}
              className="space-y-4"
            >

              <input
                type="text"
                value={editFilterName}
                onChange={(e) =>
                  setEditFilterName(
                    e.target.value
                  )
                }
                className="w-full border p-3 rounded-lg text-black"
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg"
              >

                Update Filter

              </button>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}
