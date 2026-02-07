/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: safe */
import { useState } from "react";

// import { useQueryClient } from "@tanstack/react-query";

// import { useQueryClient } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import {
  BellIcon,
  CalendarIcon,
  CheckCircleIcon,
  CopyIcon,
} from "@phosphor-icons/react";
import {
  type CreateApiKeyRequest,
  type CreateApiKeyRequestEncoded,
  CreateApiKeyRequestSchema,
} from "@yellow-rpc/api";
import { AddressSchema } from "@yellow-rpc/schema";
import { format } from "date-fns";
import { Effect } from "effect";
// import { Effect } from "effect";
import { Controller, useForm } from "react-hook-form";
import { useConnection, useWalletClient } from "wagmi";

import { BaseIcon, EthereumIcon, OptimismIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { YellowRpcHttpClient } from "@/layers";
import { queryKeys } from "@/lib/query";
import { RuntimeClient } from "@/lib/runtime";

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

export const CreateApiKeyForm = () => {
  const { address } = useConnection();
  const { data: walletClient } = useWalletClient();
  const queryClient = useQueryClient();
  const form = useForm<
    CreateApiKeyRequestEncoded,
    unknown,
    CreateApiKeyRequest
  >({
    defaultValues: {
      chain: "ethereum",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      name: "",
      ownerAddress: address ? AddressSchema.make(address) : undefined,
    },
    resolver: effectTsResolver(CreateApiKeyRequestSchema),
  });

  const [apiKey, setApiKey] = useState<string | undefined>();

  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const onSubmit = async (data: CreateApiKeyRequest) => {
    if (!address) return;
    if (!walletClient) return;
    const walletAddress = AddressSchema.make(address);
    const program = Effect.gen(function* () {
      const client = yield* YellowRpcHttpClient;
      const { apiKey } = yield* client.apiKey.create({
        payload: data,
      });
      return apiKey;
    });

    const apiKey = await RuntimeClient.runPromise(program);
    setApiKey(apiKey);
    await queryClient.invalidateQueries({
      ...queryKeys.apiKeys.list(walletAddress),
    });
  };

  return (
    <form
      className="space-y-3"
      id="create-api-key"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {apiKey && (
        <div className="flex flex-col items-start gap-2 bg-green-400/10! p-2 text-sm rounded-lg border-green-400/20 border">
          <div className="flex flex-row items-start gap-2">
            <BellIcon className="size-5 pt-0.5" />
            <div className="text-sm">
              Make sure to save this API Key, you will not be able to see it
              again.
            </div>
          </div>
          <div className="flex flex-row items-center justify-between bg-muted px-2 py-1 rounded-sm border w-full">
            <span>{apiKey}</span>
            <Button
              className=""
              onClick={() => copyToClipboard(apiKey)}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              {copied ? <CheckCircleIcon /> : <CopyIcon />}
            </Button>
          </div>
        </div>
      )}
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
      <Button className="w-full" type="submit">
        Create API Key
      </Button>
    </form>
  );
};
