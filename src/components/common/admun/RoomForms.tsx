import { useState } from "react";
import { useForm } from "react-hook-form";

type RoomFormValues = {
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  imageUrl: string;
};

export default function RoomForm() {
  const [feedback, setFeedback] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RoomFormValues>({
    defaultValues: {
      title: "",
      description: "",
      category: "Mystery",
      difficulty: "easy",
      imageUrl: "/images/mansion.jpg",
    },
  });

  const imageUrl = watch("imageUrl");

  function onSubmit(data: RoomFormValues) {
    console.log(data);
    setFeedback("Form is valid! Saving will be added later.");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, () => setFeedback(""))}
      onChange={() => setFeedback("")}
      noValidate
    >
      <div>
        <label htmlFor="title">Room name</label>
        <input
          id="title"
          {...register("title", {
            validate: (value) =>
              value.trim().length > 0 || "Please enter a room name",
          })}
        />
        {errors.title && (
          <p role="alert">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={4}
          {...register("description", {
            validate: (value) =>
              value.trim().length > 0 || "Please enter a description",
          })}
        />
        {errors.description && (
          <p role="alert">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          {...register("category", {
            required: "Please select a category",
          })}
        >
          <option value="Mystery">Mystery</option>
          <option value="Adventure">Adventure</option>
        </select>
        {errors.category && (
          <p role="alert">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="difficulty">Difficulty</label>
        <select
          id="difficulty"
          {...register("difficulty", {
            required: "Please select a difficulty",
          })}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        {errors.difficulty && (
          <p role="alert">{errors.difficulty.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="imageUrl">Room image</label>
        <select
          id="imageUrl"
          {...register("imageUrl", {
            required: "Please select an image",
          })}
        >
          <option value="/images/mansion.jpg">
            The Mysterious Mansion
          </option>
        </select>
        {errors.imageUrl && (
          <p role="alert">{errors.imageUrl.message}</p>
        )}
      </div>

      <div>
        <p>Click on the image to choose a hotspot location.</p>

        <img
          src={imageUrl}
          alt="Room preview for placing hotspots"
          draggable={false}
          style={{
            display: "block",
            width: "100%",
            maxWidth: "700px",
            height: "auto",
            padding: 0,
            border: 0,
            cursor: "crosshair",
          }}
          onClick={(event) => {
            const bounds =
              event.currentTarget.getBoundingClientRect();

            const xpercent = Math.min(
              100,
              Math.max(
                0,
                ((event.clientX - bounds.left) / bounds.width) * 100
              )
            );

            const ypercent = Math.min(
              100,
              Math.max(
                0,
                ((event.clientY - bounds.top) / bounds.height) * 100
              )
            );

            console.log({ xpercent, ypercent });
          }}
        />
      </div>

      <button type="submit">Check form</button>

      {feedback && <p role="status">{feedback}</p>}
    </form>
  );
}