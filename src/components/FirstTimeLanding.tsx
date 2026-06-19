import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useQuery } from "@tanstack/react-query";
import { retrieveAvailableProviders } from "@/lib/retrieveAvailableProviders";
import type { Provider, Providers } from "@/lib/retrieveAvailableProviders";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useVars } from "@/lib/state";

export function FirstTimeLaunch() {
  const { data } = useQuery<Providers>({
    queryKey: ["providers"],
    queryFn: () => retrieveAvailableProviders(),
  });

  const addProvider = useVars((state) => state.setProvider);

  function setProvider(provData: Provider) {
    addProvider({ ...provData });
  }

  return (
    <div className="p-3">
      {/* provider selection header */}
      <div className="text-center">
        <h1 className="text-3xl">
          Welcome to <i>bus?</i>
        </h1>
        <h3 className="text-base mt-1">
          To start, select a provider from the list below.
        </h3>

        {/* provider unavailable information popover */}
        <Popover>
          <PopoverTrigger asChild className="cursor-pointer">
            <i>
              <u>Why is a provider not on the list?</u>
            </i>
          </PopoverTrigger>
          <PopoverContent>
            <p>
              The bus tracker&nbsp;
              <b>only tracks major transit bus providers in Malaysia</b>, in
              which the data is retrieved from Malaysia's open data platform (
              <i>data.gov.my</i>).
              <br />
              <br />
              If you are finding a bus that matches the above condition but it
              is not available on the list:
              <ul className="list-disc ms-5">
                <li>
                  The bus provider is intentionally disabled due to the lack of
                  GTFS realtime data on the open data platform. Realtime bus
                  data can be checked from official sources
                </li>
                <li>
                  The bus provider is not implemented on this web app yet.
                  Status can be checked from the GitHub page of this project,
                  which can be accessed{" "}
                  <a
                    href="https://github.com/weareblahs/bus"
                    className="underline"
                  >
                    here
                  </a>
                </li>
              </ul>
            </p>
          </PopoverContent>
        </Popover>
      </div>

      {/* main data */}
      <div className="mt-3">
        {data ? (
          <div className="flex flex-col w-full">
            {data.map((d: Provider) => {
              return (
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button className="p-8 text-xl w-full">{d.name}</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogDescription>
                        <p>
                          Are you sure you want to set the provider to{" "}
                          <b>{d.name}</b>? You can change the provider later on
                          in Settings.
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => setProvider(d)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              );
            })}
          </div>
        ) : (
          "Loading"
        )}
      </div>
    </div>
  );
}
