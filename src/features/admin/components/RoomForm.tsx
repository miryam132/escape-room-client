import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { CATEGORIES, DIFFICULTIES, MAX_HOTSPOTS, MIN_HOTSPOTS, ROOM_IMAGES } from "../../../constants";
import { EMPTY_HOTSPOT } from "../mappers";
import type { RoomFormValues } from "../mappers";
import Field from "./Field";
import HotspotEditor from "./HotspotEditor";
import HotspotFields from "./HotspotFields";

type RoomFormProps = {
  initialValues?: RoomFormValues;
  onSave: (values: RoomFormValues) => Promise<void>;
};

const EMPTY_ROOM: RoomFormValues = {
  title: "",
  description: "",
  category: CATEGORIES[0],
  difficulty: DIFFICULTIES[0],
  imageUrl: ROOM_IMAGES[0].value,
  hotspots: [],
};

const required = (message: string) => (value: string) => value.trim().length > 0 || message;

export default function RoomForm({ initialValues, onSave }: RoomFormProps) {
  const [feedback, setFeedback] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormValues>({ defaultValues: initialValues ?? EMPTY_ROOM });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "hotspots",
    rules: {
      validate: (hotspots) => {
        if (hotspots.length < MIN_HOTSPOTS) return `Please place at least ${MIN_HOTSPOTS} hotspot.`;
        const finals = hotspots.filter((h) => h.type === "puzzle" && h.isFinal).length;
        return finals === 1 || "Exactly one puzzle must be marked as the final puzzle.";
      },
    },
  });

  const imageUrl = useWatch({ control, name: "imageUrl" });
  const currentHotspots = useWatch({ control, name: "hotspots" });

  async function onSubmit(data: RoomFormValues) {
    setFeedback("");
    try {
      await onSave(data);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "שמירת החדר נכשלה");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, () => setFeedback(""))} onChange={() => setFeedback("")} noValidate>
      <fieldset disabled={isSubmitting} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <Field id="title" label="Room name" error={errors.title?.message}>
          <input id="title" {...register("title", { validate: required("Please enter a room name") })} />
        </Field>

        <Field id="description" label="Description" error={errors.description?.message}>
          <textarea id="description" rows={4} {...register("description", { validate: required("Please enter a description") })} />
        </Field>

        <Field id="category" label="Category">
          <select id="category" {...register("category")}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field id="difficulty" label="Difficulty">
          <select id="difficulty" {...register("difficulty")}>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d[0].toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
        </Field>

        <Field id="imageUrl" label="Room image">
          <select id="imageUrl" {...register("imageUrl")}>
            {ROOM_IMAGES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <HotspotEditor
          imageUrl={imageUrl}
          hotspots={fields}
          maxHotspots={MAX_HOTSPOTS}
          onAdd={(position) => {
            append({ ...EMPTY_HOTSPOT, ...position, id: crypto.randomUUID() }, { shouldFocus: false });
            setFeedback("");
          }}
          onRemoveLast={() => {
            remove(fields.length - 1);
            setFeedback("");
          }}
        />

        {errors.hotspots?.root && <p role="alert">{errors.hotspots.root.message}</p>}

        {fields.map((field, index) => (
          <HotspotFields
            key={field.id}
            index={index}
            hotspots={currentHotspots}
            register={register}
            errors={errors.hotspots?.[index]}
          />
        ))}

        <button type="submit">{isSubmitting ? "שומר..." : "שמור חדר"}</button>
      </fieldset>

      {feedback && <p role="alert">{feedback}</p>}
    </form>
  );
}
