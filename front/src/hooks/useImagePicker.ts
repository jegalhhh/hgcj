import { useCallback } from "react";

const IMAGE_ACCEPT =
  "image/*,.png,.jpg,.jpeg,.jfif,.pjpeg,.pjp,.webp,.gif,.bmp,.tif,.tiff,.heic,.heif";

const isLikelyImage = (file: File) => {
  if (file.type?.startsWith("image/")) return true;
  const name = file.name?.toLowerCase() || "";
  return /\.(png|jpe?g|jfif|pjpeg|pjp|webp|gif|bmp|tiff?|heic|heif)$/i.test(
    name
  );
};

export const useImagePicker = () => {
  const createInput = (opts: {
    accept?: string;
    multiple?: boolean;
    capture?: "environment" | "user" | boolean;
  }) => {
    const input = document.createElement("input");
    input.type = "file";
    if (opts.accept) input.accept = opts.accept;
    if (opts.multiple) input.multiple = true;
    if (opts.capture) {
      input.setAttribute(
        "capture",
        typeof opts.capture === "string" ? opts.capture : "environment"
      );
    }
    Object.assign(input.style, {
      position: "fixed",
      left: "-9999px",
      top: "0",
    });
    document.body.appendChild(input);
    return input;
  };

  const pickImages = useCallback(
    (multiple = false, maxCount = 1): Promise<File[]> =>
      new Promise((resolve) => {
        const input = createInput({ accept: IMAGE_ACCEPT, multiple });
        input.addEventListener(
          "change",
          () => {
            const all = Array.from(input.files ?? []);
            const imgs = all.filter((f) => isLikelyImage(f));
            const limited = multiple
              ? imgs.slice(0, maxCount)
              : imgs.slice(0, 1);
            resolve(limited);
            input.remove();
          },
          { once: true }
        );
        input.click();
      }),
    []
  );

  const pickFiles = useCallback(
    (opts?: {
      multiple?: boolean;
      maxCount?: number;
      accept?: string;
    }): Promise<File[]> =>
      new Promise((resolve) => {
        const multiple = opts?.multiple ?? false;
        const maxCount = opts?.maxCount ?? 1;
        const accept = opts?.accept ?? IMAGE_ACCEPT;
        const input = createInput({ accept, multiple });
        input.addEventListener(
          "change",
          () => {
            const all = Array.from(input.files ?? []);
            const imgs = all.filter((f) => isLikelyImage(f));
            const limited = multiple
              ? imgs.slice(0, maxCount)
              : imgs.slice(0, 1);
            resolve(limited);
            input.remove();
          },
          { once: true }
        );
        input.click();
      }),
    []
  );

  const takePhoto = useCallback(
    (): Promise<File | null> =>
      new Promise((resolve) => {
        const input = createInput({
          accept: IMAGE_ACCEPT,
          capture: "environment",
        });
        input.addEventListener(
          "change",
          () => {
            const f = input.files?.[0] ?? null;
            const ok = f && isLikelyImage(f);
            resolve(ok ? f! : null);
            input.remove();
          },
          { once: true }
        );
        input.click();
      }),
    []
  );

  return { pickImages, pickFiles, takePhoto };
};
