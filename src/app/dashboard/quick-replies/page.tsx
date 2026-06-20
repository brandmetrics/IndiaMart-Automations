"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

export default function QuickRepliesPage() {
    const [search, setSearch] =
  useState("");
  const [showAddModal, setShowAddModal] =
  useState(false);

  const [editId, setEditId] =
  useState<number | null>(null);

  const [replies, setReplies] =
  useState<any[]>([]);  

  const [title, setTitle] =
  useState("");

const [replyText, setReplyText] =
  useState("");

  const fetchReplies = async () => {

  const res =
    await fetch(
      "/api/quick-replies"
    );

  const data =
    await res.json();

  setReplies(data);

};

const copyReply = async (text: string) => {
  await navigator.clipboard.writeText(text);
 toast.success("Copied to Clipboard");

};

const filteredReplies =
  replies.filter((reply) =>
    
    reply.reply_text
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
  );

  useEffect(() => {

  fetchReplies();

}, []);

  return (

    <div className="p-6">

      <div className="bg-white rounded-xl p-4 shadow">

        <div className="flex justify-between items-center mb-6 text-black">

          <input
            placeholder="Search Replies..."
            value={search}
            onChange={(e) => 
                setSearch(e.target.value)
            }
            className=" border rounded-lg px-4 py-2 w-80 text-black"
          />

          <button
          onClick={() => 
            setShowAddModal(true)
          }
            className=" bg-black text-white px-4 py-2 rounded-lg"
          >
            Add Reply
          </button>

        </div>
        <div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-black">

             {filteredReplies.map((reply) => (

          <div
            key={reply.id}
            onClick={ () => 
                copyReply(reply.text)
            }
            className=" border-2 rounded-xl p-5 cursor-pointer hover:shadow-lg transition"
          >



            <p 
   className=" reply-text mt-4">
              {reply.reply_text}
            </p>

            <div className="flex justify-end gap-3 mt-4">

         <button
         onClick={(e) => {
            e.stopPropagation();
            setEditId(reply.id);

    setTitle(reply.title);

    setReplyText(
      reply.reply_text
    );

    setShowAddModal(true);
         } }
         >
              ✏️
            </button>

         <button 
         onClick={async(e) => {
            e.stopPropagation();
             await fetch(
      "/api/quick-replies",
      {
        method: "DELETE",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            id: reply.id,
          }),
      }
    );

    toast.success(
      "Reply Deleted"
    );

    fetchReplies();

         }}
         >
              🗑️
            </button>
            </div>
            
        </div>

        ))}

        </div>

      </div>

      {
      showAddModal && (

        <div className="
          fixed inset-0
          bg-black/50
          flex items-center justify-center
        ">

          <div className="
            bg-white
            p-6
            rounded-xl
            w-[500px] text-black
          ">

            <h2 className="text-xl font-bold mb-4">
              Add Reply
            </h2>



            <textarea
            value={replyText}
            onChange={(e) => 
                setReplyText(e.target.value)
            }
              placeholder="Reply Text"
              className="border p-2 w-full h-32"
            />

            <div className="flex justify-end gap-2 mt-4">

              <button
                onClick={() => {
  setShowAddModal(false);
  setEditId(null);

  setReplyText("");
}}
                className="px-4 py-2 border rounded text-black"
              >
                Cancel
              </button>

              <button
  onClick={async () => {

    if (editId) {

      await fetch(
        "/api/quick-replies",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              id: editId,

              reply_text:
                replyText,
            }),
        }
      );

      toast.success(
        "Reply Updated"
      );

    } else {

      await fetch(
        "/api/quick-replies",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({

              reply_text:
                replyText,
            }),
        }
      );

      toast.success(
        "Reply Added"
      );

    }

    setShowAddModal(false);

    setEditId(null);



    setReplyText("");

    fetchReplies();

  }}
  className="px-4 py-2 bg-black text-white rounded"
>
  Save
</button>

            </div>

          </div>

        </div>

      )
    }

    </div>

  );

}