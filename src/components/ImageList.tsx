import { For, Show, onMount } from "solid-js";
import Box from "@suid/material/Box";
import Button from "@suid/material/Button";
import Paper from "@suid/material/Paper";
import Table from "@suid/material/Table";
import TableBody from "@suid/material/TableBody";
import TableCell from "@suid/material/TableCell";
import TableContainer from "@suid/material/TableContainer";
import TableHead from "@suid/material/TableHead";
import TableRow from "@suid/material/TableRow";
import Typography from "@suid/material/Typography";
import { fetchImages } from "../api/fetchImages";
import { images, setIsOpenedConfirm, setSelectedTag } from "../signal";
import { formatDateTimeDisplay } from "../formatDateTime";

export const ImageList = () => {
  onMount(async () => {
    if (images() == undefined) {
      await fetchImages();
    }
  });

  return (
    <Show when={images() !== undefined} fallback={<></>}>
      <Box
        sx={{
          width: "100%",
          minWidth: "1024px",
          display: "flex",
        }}
        aria-live="polite"
      >
        <Show
          when={images() !== null}
          fallback={
            <Typography variant="h6">
              リポジトリにイメージがありません
            </Typography>
          }
        >
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>選択</TableCell>
                  <TableCell>イメージタグ</TableCell>
                  <TableCell>プッシュ日時</TableCell>
                  <TableCell>
                    サイズ
                    <br />
                    （MB）
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <For each={images()} fallback={<></>}>
                  {(imageItem) => (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <Button
                          variant={
                            imageItem.tags.filter((n) => n === "release")
                              .length > 0
                              ? "contained"
                              : "outlined"
                          }
                          size="small"
                          color={
                            imageItem.tags.filter((n) => n === "release")
                              .length > 0
                              ? "primary"
                              : "inherit"
                          }
                          onClick={async (e) => {
                            if (
                              imageItem.tags.filter((n) => n === "release")
                                .length == 0
                            ) {
                              setSelectedTag(imageItem.tags[0]);
                              setIsOpenedConfirm(true);
                            }
                          }}
                          sx={{ textTransform: "none" }}
                          title={`${imageItem.tags.join(", ")} を選択`}
                        >
                          選択
                        </Button>
                      </TableCell>
                      <TableCell>{imageItem.tags.join(", ")}</TableCell>
                      <TableCell>
                        {formatDateTimeDisplay(new Date(imageItem.pushed_at))}
                      </TableCell>
                      <TableCell align="right">
                        {(
                          Math.round(
                            (imageItem.size / (1000 * 1000)) * Math.pow(10, 2)
                          ) / Math.pow(10, 2)
                        ).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )}
                </For>
              </TableBody>
            </Table>
          </TableContainer>
        </Show>
      </Box>
    </Show>
  );
};
