import { Component } from "solid-js";
import Box from "@suid/material/Box";
import Stack from "@suid/material/Stack";
import { ThemeProvider } from "@suid/material";
import { ColorTheme } from "../ColorTheme";
import { ImageList } from "./ImageList";
import { Message } from "./Message";
import { TitleBar } from "./TitleBar";
import { Confirm } from "./Confirm";

export const App: Component = () => {
  return (
    <ThemeProvider theme={ColorTheme}>
      <TitleBar />
      <Box
        sx={{
          padding: "10px 10px 0 10px",
          width: "100%",
          minWidth: "1024px",
          display: "flex",
          // justifyContent: "center",
        }}
        aria-live="polite"
      >
        <Stack spacing={2} direction="column">
          <Message />
          <ImageList />
          <Confirm />
        </Stack>
      </Box>
    </ThemeProvider>
  );
};
