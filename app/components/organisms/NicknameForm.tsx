import useNicknameStore from "~/stores/useNicknameStore";
import TextField from "../atoms/TextField";
import Button from "../atoms/Button";
import { Form } from "react-router";
import { useState } from "react";

const NicknameForm = () => {
  const { setNickname } = useNicknameStore();
  const [fieldValue, setFieldValue] = useState<string>("");

  const handleSubmit = () => {
    console.log("nickname:", fieldValue);
    if (!fieldValue) console.log("NO NAME!");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Form onSubmit={handleSubmit}>
        <label className="relative">
          <span className="absolute -top-8">Enter your nickname</span>
          <TextField
            className="w-full"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            spellCheck={false}
          />
        </label>

        <Button type="submit" className="mt-2 w-full">
          Play
        </Button>
      </Form>
    </div>
  );
};

export default NicknameForm;
