import type { FieldErrors, UseFormRegister } from "react-hook-form";
import Field from "../../../components/common/Field";
import type { HotspotFormValues, RoomFormValues } from "../mappers";

type Props = {
  index: number;
  hotspots: HotspotFormValues[];
  register: UseFormRegister<RoomFormValues>;
  errors?: FieldErrors<HotspotFormValues>;
};

const required = (message: string) => (value: string) => value.trim().length > 0 || message;

/** Walks the "requires" chain from `startId`; true if it loops back to `currentId`. */
function hasCycle(hotspots: HotspotFormValues[], currentId: string, startId: string) {
  const visited = new Set([currentId]);
  for (let id = startId; id; ) {
    if (visited.has(id)) return true;
    visited.add(id);
    id = hotspots.find((h) => h.id === id)?.requiresHotspotId ?? "";
  }
  return false;
}

export default function HotspotFields({ index, hotspots, register, errors }: Props) {
  const name = `hotspots.${index}` as const;
  const id = (suffix: string) => `hotspot-${suffix}-${index}`;
  const isPuzzle = hotspots[index]?.type === "puzzle";

  // Only validate puzzle-only fields when the hotspot is a puzzle.
  const puzzleRequired = (message: string) => (value: string, values: RoomFormValues) =>
    values.hotspots[index].type !== "puzzle" || required(message)(value);

  return (
    <fieldset>
      <legend>Hotspot {index + 1}</legend>

      <Field id={id("label")} label="Item name" error={errors?.label?.message}>
        <input id={id("label")} {...register(`${name}.label`, { validate: required("Please enter an item name") })} />
      </Field>

      <Field id={id("type")} label="Hotspot type">
        <select id={id("type")} {...register(`${name}.type`)}>
          <option value="info">Information</option>
          <option value="puzzle">Puzzle</option>
        </select>
      </Field>

      <Field id={id("content")} label="Content" error={errors?.content?.message}>
        <textarea id={id("content")} rows={3} {...register(`${name}.content`, { validate: required("Please enter content") })} />
      </Field>

      <Field id={id("requires")} label="Unlock after solving" error={errors?.requiresHotspotId?.message}>
        <select
          id={id("requires")}
          {...register(`${name}.requiresHotspotId`, {
            validate: (value, { hotspots: all }) => {
              if (!value) return true;
              const prerequisite = all.find((h) => h.id === value);
              if (!prerequisite || prerequisite.type !== "puzzle") return "Please select an existing puzzle";
              if (hasCycle(all, all[index].id, value)) return "Hotspot dependencies cannot form a cycle";
              return true;
            },
          })}
        >
          <option value="">Available immediately</option>
          {hotspots.map((item, i) =>
            i !== index && item.type === "puzzle" ? (
              <option key={item.id} value={item.id}>
                {item.label || `Hotspot ${i + 1}`}
              </option>
            ) : null,
          )}
        </select>
      </Field>

      {isPuzzle && (
        <>
          <Field id={id("question")} label="Question" error={errors?.question?.message}>
            <textarea id={id("question")} rows={3} {...register(`${name}.question`, { validate: puzzleRequired("Please enter a question") })} />
          </Field>

          <Field id={id("hint")} label="Hint" error={errors?.hint?.message}>
            <input id={id("hint")} {...register(`${name}.hint`, { validate: puzzleRequired("Please enter a hint") })} />
          </Field>

          <Field id={id("answer-type")} label="Answer type">
            <select id={id("answer-type")} {...register(`${name}.answerType`)}>
              <option value="text">Text</option>
              <option value="number">Number</option>
            </select>
          </Field>

          <Field id={id("answer")} label="Correct answer" error={errors?.answer?.message}>
            <input
              id={id("answer")}
              {...register(`${name}.answer`, {
                validate: (value, values) => {
                  const hotspot = values.hotspots[index];
                  if (hotspot.type !== "puzzle") return true;
                  if (!value.trim()) return "Please enter the correct answer";
                  if (hotspot.answerType === "number" && !Number.isFinite(Number(value))) {
                    return "Please enter a valid number";
                  }
                  return true;
                },
              })}
            />
          </Field>

          <div>
            <label htmlFor={id("final")}>
              <input id={id("final")} type="checkbox" {...register(`${name}.isFinal`)} />
              Final puzzle
            </label>
          </div>
        </>
      )}
    </fieldset>
  );
}
