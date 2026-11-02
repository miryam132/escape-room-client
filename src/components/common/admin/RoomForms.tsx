import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import HotspotEditor from "./HotspotEditor";

export type HotspotFormValues = {
  id: string;
  type: "info" | "puzzle";
  label: string;
  xPercent: number;
  yPercent: number;
  content: string;
  requiresHotspotId: string;
  question: string;
  answerType: "text" | "number";
  answer: string;
  hint: string;
  isFinal: boolean;
};

export type RoomFormValues = {
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  imageUrl: string;
  hotspots: HotspotFormValues[];
};
type RoomFormProps = {
  initialValues?: RoomFormValues;
  onSave: (values: RoomFormValues) => Promise<void>;
};

const EMPTY_ROOM: RoomFormValues = {
  title: "",
  description: "",
  category: "Mystery",
  difficulty: "easy",
  imageUrl: "/images/mansion.jpg",
  hotspots: [],
};

const HOTSPOT_COUNT = 3;


export default function RoomForm({
  initialValues,
  onSave,
}: RoomFormProps) {
  const [feedback, setFeedback] = useState("");

const {
  register,
  control,
  handleSubmit,
  watch,
formState: { errors, isSubmitting },} = useForm<RoomFormValues>({
  defaultValues: initialValues ?? EMPTY_ROOM,
});
const { fields, append, remove } = useFieldArray({
  control,
  name: "hotspots",
  rules: {
    validate: (hotspots) =>
      hotspots.length === HOTSPOT_COUNT ||
      `Please place exactly ${HOTSPOT_COUNT} hotspots.`,
  },
});

  const imageUrl = watch("imageUrl");
  const currentHotspots = watch("hotspots");
 async function onSubmit(data: RoomFormValues) {
  setFeedback("");

  try {
    await onSave(data);
  } catch (error) {
    setFeedback(
      error instanceof Error ? error.message : "שמירת החדר נכשלה",
    );
  }
}
  

  return (
   <form
  onSubmit={handleSubmit(onSubmit, () => setFeedback(""))}
  onChange={() => setFeedback("")}
  noValidate
>
  <fieldset
    disabled={isSubmitting}
    style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
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

     <HotspotEditor
  imageUrl={imageUrl}
  hotspots={fields}
  maxHotspots={HOTSPOT_COUNT}
  onAdd={(position) => {
append(
  {
    id: crypto.randomUUID(),
    ...position,
    type: "info",
    label: "",
    content: "",
    requiresHotspotId: "",
    question: "",
    answerType: "text",
    answer: "",
    hint: "",
    isFinal: false,
  },
  { shouldFocus: false },
);

  setFeedback("");
}}
  onRemoveLast={() => {
    if (fields.length === 0) return;

    remove(fields.length - 1);
    setFeedback("");
  }}
/>

{errors.hotspots?.root && (
  <p role="alert">{errors.hotspots.root.message}</p>
)}
{fields.map((field, index) => {
  const hotspotErrors = errors.hotspots?.[index];
  const isPuzzle = currentHotspots[index]?.type === "puzzle";

  return (
    <fieldset key={field.id}>
      <legend>Hotspot {index + 1}</legend>

      <div>
        <label htmlFor={`hotspot-label-${index}`}>
          Item name
        </label>
        <input
          id={`hotspot-label-${index}`}
          {...register(`hotspots.${index}.label`, {
            validate: (value) =>
              value.trim().length > 0 || "Please enter an item name",
          })}
        />
        {hotspotErrors?.label && (
          <p role="alert">{hotspotErrors.label.message}</p>
        )}
      </div>

      <div>
        <label htmlFor={`hotspot-type-${index}`}>
          Hotspot type
        </label>
        <select
          id={`hotspot-type-${index}`}
          {...register(`hotspots.${index}.type`)}
        >
          <option value="info">Information</option>
          <option value="puzzle">Puzzle</option>
        </select>
      </div>

      <div>
        <label htmlFor={`hotspot-content-${index}`}>
          Content
        </label>
        <textarea
          id={`hotspot-content-${index}`}
          rows={3}
          {...register(`hotspots.${index}.content`, {
            validate: (value) =>
              value.trim().length > 0 || "Please enter content",
          })}
        />
        {hotspotErrors?.content && (
          <p role="alert">{hotspotErrors.content.message}</p>
        )}
      </div>

      <div>
        <label htmlFor={`hotspot-requires-${index}`}>
          Unlock after solving
        </label>
        <select
          id={`hotspot-requires-${index}`}
          {...register(`hotspots.${index}.requiresHotspotId`, {
            validate: (value, values) => {
              if (!value) return true;

              const current = values.hotspots[index];
              const prerequisite = values.hotspots.find(
                (item) => item.id === value,
              );

              if (value === current.id) {
                return "A hotspot cannot depend on itself";
              }

              if (!prerequisite || prerequisite.type !== "puzzle") {
                return "Please select an existing puzzle";
              }

              // Detect circular dependencies.
              const visited = new Set<string>([current.id]);
              let nextId = value;

              while (nextId) {
                if (visited.has(nextId)) {
                  return "Hotspot dependencies cannot form a cycle";
                }

                visited.add(nextId);

                nextId =
                  values.hotspots.find((item) => item.id === nextId)
                    ?.requiresHotspotId ?? "";
              }

              return true;
            },
          })}
        >
          <option value="">Available immediately</option>

          {currentHotspots.map((item, otherIndex) =>
            otherIndex !== index && item.type === "puzzle" ? (
              <option key={item.id} value={item.id}>
                {item.label || `Hotspot ${otherIndex + 1}`}
              </option>
            ) : null,
          )}
        </select>

        {hotspotErrors?.requiresHotspotId && (
          <p role="alert">
            {hotspotErrors.requiresHotspotId.message}
          </p>
        )}
      </div>

      {isPuzzle && (
        <>
          <div>
            <label htmlFor={`hotspot-question-${index}`}>
              Question
            </label>
            <textarea
              id={`hotspot-question-${index}`}
              rows={3}
              {...register(`hotspots.${index}.question`, {
                validate: (value, values) =>
                  values.hotspots[index].type !== "puzzle" ||
                  value.trim().length > 0 ||
                  "Please enter a question",
              })}
            />
            {hotspotErrors?.question && (
              <p role="alert">{hotspotErrors.question.message}</p>
            )}
          </div>

          <div>
            <label htmlFor={`hotspot-hint-${index}`}>
              Hint
            </label>
            <input
              id={`hotspot-hint-${index}`}
              {...register(`hotspots.${index}.hint`, {
                validate: (value, values) =>
                  values.hotspots[index].type !== "puzzle" ||
                  value.trim().length > 0 ||
                  "Please enter a hint",
              })}
            />
            {hotspotErrors?.hint && (
              <p role="alert">{hotspotErrors.hint.message}</p>
            )}
          </div>

          <div>
            <label htmlFor={`hotspot-answer-type-${index}`}>
              Answer type
            </label>
            <select
              id={`hotspot-answer-type-${index}`}
              {...register(`hotspots.${index}.answerType`)}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
            </select>
          </div>

          <div>
            <label htmlFor={`hotspot-answer-${index}`}>
              Correct answer
            </label>
            <input
              id={`hotspot-answer-${index}`}
              {...register(`hotspots.${index}.answer`, {
                validate: (value, values) => {
                  const hotspot = values.hotspots[index];

                  if (hotspot.type !== "puzzle") return true;

                  if (!value.trim()) {
                    return "Please enter the correct answer";
                  }

                  if (
                    hotspot.answerType === "number" &&
                    !Number.isFinite(Number(value))
                  ) {
                    return "Please enter a valid number";
                  }

                  return true;
                },
              })}
            />
            {hotspotErrors?.answer && (
              <p role="alert">{hotspotErrors.answer.message}</p>
            )}
          </div>

          <div>
            <label htmlFor={`hotspot-final-${index}`}>
              <input
                id={`hotspot-final-${index}`}
                type="checkbox"
                {...register(`hotspots.${index}.isFinal`)}
              />
              Final puzzle
            </label>
          </div>
        </>
      )}
    </fieldset>
  );
})}

              <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "שומר..." : "שמור חדר"}
        </button>
      </fieldset>

      {feedback && <p role="alert">{feedback}</p>}
    </form>
  );
}

