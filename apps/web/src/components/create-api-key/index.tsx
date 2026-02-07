import { PlusIcon } from "@phosphor-icons/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { CreateApiKeyForm } from "./form";

export const CreateApiKey = () => {
  return (
    <Dialog disablePointerDismissal={true}>
      <DialogTrigger render={<Button variant="outline" />}>
        <PlusIcon />
        Create API Key
      </DialogTrigger>
      <DialogContent className="px-5! py-6! max-w-md! w-full">
        <DialogHeader className="text-xl">
          <DialogTitle className="pb-2">Create API Key</DialogTitle>
          <CreateApiKeyForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
