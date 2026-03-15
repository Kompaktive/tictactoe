import { useState } from "react";
import useNicknameStore from "~/stores/useNicknameStore";
import { Form } from "react-router";
import TextField from "../atoms/TextField";
import Button from "../atoms/Button";

const Menu = () => {
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

        <div className="mt-2 flex items-center gap-x-2">
          <Button type="submit" className="w-full">
            Play vs AI
          </Button>
          <Button className="w-full">Difficulty: Impossible</Button>
        </div>
      </Form>
    </div>
  );
};

export default Menu;
