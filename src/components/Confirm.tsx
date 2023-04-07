import { Show } from "solid-js";
import { useTheme } from "@suid/material";
import Box from "@suid/material/Box";
import Button from "@suid/material/Button";
// import Modal from "@suid/material/Modal";
import Stack from "@suid/material/Stack";
import Typography from "@suid/material/Typography";
import { updateImages } from "../api/updateImages";
import { isOpenedConfirm, setIsOpenedConfirm } from "../signal";

export const Confirm = () => {
  const handleClose = () => setIsOpenedConfirm(false);
  const theme = useTheme();

  return (
    <Show when={isOpenedConfirm() === true} fallback={<></>}>
      {/* <Modal
        open={isOpenedConfirm()}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        title="modal"
      > */}
      <Box
        sx={{
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: theme.palette.background.paper,
          border: "2px solid #000",
          boxShadow: "24px",
          p: 4,
        }}
      >
        <Typography variant="subtitle1">
          本番リリース時に使用するイメージを選択します。
        </Typography>
        <Typography variant="subtitle1">よろしいですか？</Typography>
        <Box sx={{ paddingTop: "20px" }}></Box>
        <Stack spacing={4} direction="row" sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={async (e) => {
              setIsOpenedConfirm(false);
              await updateImages();
            }}
            title="はい"
          >
            はい
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            onClick={async (e) => {
              setIsOpenedConfirm(false);
            }}
            title="いいえ"
          >
            いいえ
          </Button>
        </Stack>
      </Box>
      {/* </Modal> */}
    </Show>
  );
};
