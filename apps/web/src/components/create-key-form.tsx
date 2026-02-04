import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { CalendarIcon } from "@phosphor-icons/react";
import {
  type PrepareApiKeyRequest,
  type PrepareApiKeyRequestEncoded,
  PrepareApiKeyRequestSchema,
} from "@yellow-rpc/api";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BaseIcon, EthereumIcon, OptimismIcon } from "./icons";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const chains = [
  {
    icon: EthereumIcon,
    label: "Ethereum",
    value: "ethereum",
  },
  {
    icon: BaseIcon,
    label: "Base",
    value: "base",
  },
  {
    icon: OptimismIcon,
    label: "Optimism",
    value: "optimism",
  },
];

export const CreateKeyForm = () => {
  const form = useForm<
    PrepareApiKeyRequestEncoded,
    unknown,
    PrepareApiKeyRequest
  >({
    defaultValues: {
      chain: "ethereum",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      initialBalance: "0",
      name: "",
    },
    resolver: effectTsResolver(PrepareApiKeyRequestSchema),
  });

  const onSubmit = (data: PrepareApiKeyRequest) => {
    // TODO: Implement this
    console.log(data);
  };

  return (
    <form
      className="space-y-3"
      id="create-api-key"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="create-api-key-label">Label</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                id="create-api-key-label"
                placeholder="Your API Key Label"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup className="grid grid-cols-2 gap-2">
        <Controller
          control={form.control}
          name="chain"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="create-api-key-chain">Chain</FieldLabel>
              <Select
                items={chains}
                onValueChange={(value) => {
                  console.log(value);
                  field.onChange(value?.value);
                }}
                value={chains.find((c) => c.value === field.value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chain">
                    {(value: (typeof chains)[number] | undefined) => {
                      if (!value) return <>Select Chain</>;
                      return (
                        <div className="flex flex-row items-center gap-2">
                          <value.icon className="size-5 rounded-full" />
                          <span>{value.label}</span>
                        </div>
                      );
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectGroup>
                    {chains.map((chain) => (
                      <SelectItem key={chain.label} value={chain}>
                        <SelectValue className="flex flex-row items-center gap-2">
                          <chain.icon className="size-5 rounded-full" />
                          <span>{chain.label}</span>
                        </SelectValue>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="expiresAt"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="create-api-key-expiry">
                Expiry Date
              </FieldLabel>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
                      data-empty={!field.value}
                      variant="outline"
                    />
                  }
                >
                  <CalendarIcon />
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Select Expiry</span>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    hidden={{
                      before: new Date(),
                    }}
                    mode="single"
                    onSelect={(value) => field.onChange(value?.toISOString())}
                    selected={new Date(field.value)}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Controller
        control={form.control}
        name="initialBalance"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="create-api-key-balance">Label</FieldLabel>
            <InputGroup
              {...field}
              aria-invalid={fieldState.invalid}
              id="create-api-key-label"
            >
              <InputGroupInput
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                className="reset-input-number"
                id="create-api-key-label"
                placeholder="Initial Balance"
                type="number"
              />
              <InputGroupAddon align="inline-end">USD</InputGroupAddon>
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button className="w-full" type="submit">
        Create API Key
      </Button>
    </form>
  );
};
