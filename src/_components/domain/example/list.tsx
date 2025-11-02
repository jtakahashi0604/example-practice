"use client";

import Link from "next/link";

import { cn } from "@/_lib/utils";

import type * as exampleSchema from "@/_schemas/domain/example.ts";
import * as exampleAction from "@/_actions/domain/example";

import { Button } from "@/_components/ui/button";

export default function Component({
  examples,
  className,
  ...props
}: {
  examples: exampleSchema.exampleSchema[];
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const handleCreate = async () => {
    await exampleAction.create({
      data: {
        name: "Untitled",
      },
    });
  };

  return (
    <div className={cn(className)} {...props}>
      <div className="space-y-8">
        <Button onClick={handleCreate} className="w-full">
          Create
        </Button>
        {examples.length <= 0 ? (
          <div className="text-center text-muted-foreground">
            Create one to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {examples.map((example) => {
              return (
                <div key={example.id}>
                  <Link href={`/examples/${example.id}`}>
                    <div>{example.name}</div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
