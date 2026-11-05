import type { FieldErrors, UseFormRegister } from "react-hook-form";
import Field from "../../../components/common/Field";
import type { HotspotFormValues, RoomFormValues } from "../mappers";

type Props = {
  index: number;
  hotspots: HotspotFormValues[];
  register: UseFormRegister<RoomFormValues>;
  errors?: FieldErrors<HotspotFormValues>;
};

export default function HotspotFields({ index, hotspots, register, errors }: Props) {
  const name = `hotspots.${index}` as const;
  const id = (suffix: string) => `hotspot-${suffix}-${index}`;
  const current = hotspots[index];
  const isPuzzle = current?.type === "PUZZLE";
  const hasPrerequisite = Boolean(current?.prerequisiteId);

  return (
    <fieldset className="card hotspot-fields">
      <legend>נקודה {index + 1}</legend>

      <Field id={id("label")} label="שם הפריט" error={errors?.label?.message}>
        <input id={id("label")} {...register(`${name}.label`)} />
      </Field>

      <Field id={id("type")} label="סוג הנקודה">
        <select id={id("type")} {...register(`${name}.type`)}>
          <option value="INFO">מידע</option>
          <option value="PUZZLE">חידה</option>
        </select>
      </Field>

      <Field
        id={id("content")}
        label={isPuzzle ? "תיאור לפני הפתרון (לא חובה)" : "תוכן"}
        error={errors?.content?.message}
      >
        <textarea id={id("content")} rows={3} {...register(`${name}.content`)} />
      </Field>

      {isPuzzle && (
        <>
          <Field id={id("question")} label="שאלה" error={errors?.question?.message}>
            <textarea id={id("question")} rows={3} {...register(`${name}.question`)} />
          </Field>

          <Field id={id("answer-type")} label="סוג התשובה">
            <select id={id("answer-type")} {...register(`${name}.answerType`)}>
              <option value="text">טקסט</option>
              <option value="number">קוד מספרי (ספרות בלבד)</option>
            </select>
          </Field>

          <Field id={id("answer")} label="התשובה הנכונה" error={errors?.answer?.message}>
            <input id={id("answer")} {...register(`${name}.answer`)} />
          </Field>

          <Field id={id("hint")} label="רמז (לא חובה)" error={errors?.hint?.message}>
            <input id={id("hint")} {...register(`${name}.hint`)} />
          </Field>

          <Field
            id={id("solved")}
            label="תוכן שנחשף אחרי הפתרון"
            error={errors?.solvedContent?.message}
          >
            <textarea id={id("solved")} rows={3} {...register(`${name}.solvedContent`)} />
          </Field>

          <Field
            id={id("requires")}
            label="נפתח אחרי פתרון"
            error={errors?.prerequisiteId?.message}
          >
            <select id={id("requires")} {...register(`${name}.prerequisiteId`)}>
              <option value="">זמין מיד</option>
              {hotspots.map((item, i) =>
                i !== index && item.type === "PUZZLE" && !item.isFinal ? (
                  <option key={item.id} value={item.id}>
                    {item.label || `נקודה ${i + 1}`}
                  </option>
                ) : null,
              )}
            </select>
          </Field>

          {hasPrerequisite && (
            <Field
              id={id("locked")}
              label="הודעה כשהנקודה נעולה"
              error={errors?.lockedMessage?.message}
            >
              <input id={id("locked")} {...register(`${name}.lockedMessage`)} />
            </Field>
          )}

          <label htmlFor={id("final")} className="check">
            <input id={id("final")} type="checkbox" {...register(`${name}.isFinal`)} />
            חידה סופית (נפתחת אחרי שכל שאר החידות נפתרו)
          </label>
        </>
      )}
    </fieldset>
  );
}
