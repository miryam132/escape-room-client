import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import Field from "../../../components/common/Field";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  MAX_HOTSPOTS,
  ROOM_IMAGES,
} from "../../../constants";
import { EMPTY_HOTSPOT } from "../mappers";
import type { RoomFormValues } from "../mappers";
import { roomSchema } from "../roomSchema";
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

export default function RoomForm({ initialValues, onSave }: RoomFormProps) {
  const [feedback, setFeedback] = useState("");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: initialValues ?? EMPTY_ROOM,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "hotspots" });
  const imageUrl = useWatch({ control, name: "imageUrl" });
  const hotspots = useWatch({ control, name: "hotspots" });

  async function onSubmit(data: RoomFormValues) {
    setFeedback("");
    try {
      await onSave(data);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "שמירת החדר נכשלה");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} onChange={() => setFeedback("")} noValidate>
      <fieldset disabled={isSubmitting} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <Field id="title" label="שם החדר" error={errors.title?.message}>
          <input id="title" {...register("title")} />
        </Field>

        <Field id="description" label="תיאור" error={errors.description?.message}>
          <textarea id="description" rows={4} {...register("description")} />
        </Field>

        <Field id="category" label="קטגוריה">
          <select id="category" {...register("category")}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </Field>

        <Field id="difficulty" label="רמת קושי">
          <select id="difficulty" {...register("difficulty")}>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {DIFFICULTY_LABELS[d]}
              </option>
            ))}
          </select>
        </Field>

        <Field id="imageUrl" label="תמונת החדר">
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
          hotspots={hotspots}
          maxHotspots={MAX_HOTSPOTS}
          onAdd={(position) =>
            append(
              { ...EMPTY_HOTSPOT, ...position, id: crypto.randomUUID() },
              { shouldFocus: false },
            )
          }
          onMove={(index, { xPercent, yPercent }) => {
            setValue(`hotspots.${index}.xPercent`, xPercent);
            setValue(`hotspots.${index}.yPercent`, yPercent);
          }}
          onRemoveLast={() => remove(fields.length - 1)}
        />

        {(errors.hotspots?.root ?? errors.hotspots) && (
          <p role="alert">{errors.hotspots?.root?.message ?? errors.hotspots?.message}</p>
        )}

        {fields.map((field, index) => (
          <HotspotFields
            key={field.id}
            index={index}
            hotspots={hotspots}
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
