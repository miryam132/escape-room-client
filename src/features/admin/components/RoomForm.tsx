import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { errorMessage } from "../../../api/client";
import Field from "../../../components/common/Field";
import {
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  MAX_HOTSPOTS,
  SUGGESTED_CATEGORIES,
} from "../../../constants";
import { useUploadImage } from "../../../hooks/rooms";
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
  category: "",
  difficulty: DIFFICULTIES[0],
  imageUrl: "",
  imageKey: "",
  hotspots: [],
};

export default function RoomForm({ initialValues, onSave }: RoomFormProps) {
  const [feedback, setFeedback] = useState("");
  const upload = useUploadImage();

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

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setFeedback("");
    try {
      const { imageUrl, imageKey } = await upload.mutateAsync(file);
      setValue("imageUrl", imageUrl, { shouldValidate: true });
      setValue("imageKey", imageKey);
    } catch (error) {
      setFeedback(errorMessage(error, "העלאת התמונה נכשלה"));
    }
  }

  async function onSubmit(data: RoomFormValues) {
    setFeedback("");
    try {
      await onSave(data);
    } catch (error) {
      setFeedback(errorMessage(error, "שמירת החדר נכשלה"));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} onChange={() => setFeedback("")} noValidate>
      <fieldset
        disabled={isSubmitting}
        className="room-form"
        style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
      >
        <section className="card form-section">
          <h2>פרטי החדר</h2>
          <Field id="title" label="שם החדר" error={errors.title?.message}>
            <input id="title" {...register("title")} />
          </Field>

          <Field id="description" label="תיאור" error={errors.description?.message}>
            <textarea id="description" rows={4} {...register("description")} />
          </Field>

          <Field id="category" label="קטגוריה" error={errors.category?.message}>
            <input id="category" list="category-suggestions" {...register("category")} />
            <datalist id="category-suggestions">
              {SUGGESTED_CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
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
        </section>

        <section className="card form-section">
          <h2>תמונה ונקודות</h2>
          <Field
            id="image"
            label="תמונת החדר (JPEG / PNG / WebP, עד 5MB)"
            error={errors.imageUrl?.message}
          >
            <input
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {upload.isPending && <p>מעלה תמונה...</p>}
          </Field>

          {imageUrl && (
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
              onMove={(index, { xpercent, ypercent }) => {
                setValue(`hotspots.${index}.xpercent`, xpercent);
                setValue(`hotspots.${index}.ypercent`, ypercent);
              }}
              onRemoveLast={() => remove(fields.length - 1)}
            />
          )}

          {(errors.hotspots?.root ?? errors.hotspots) && (
            <p role="alert">{errors.hotspots?.root?.message ?? errors.hotspots?.message}</p>
          )}
        </section>

        <div className="hotspot-fields-grid">
          {fields.map((field, index) => (
            <HotspotFields
              key={field.id}
              index={index}
              hotspots={hotspots}
              register={register}
              errors={errors.hotspots?.[index]}
            />
          ))}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg">
            {isSubmitting ? "שומר..." : "שמור חדר"}
          </button>
        </div>
      </fieldset>

      {feedback && <p role="alert">{feedback}</p>}
    </form>
  );
}
