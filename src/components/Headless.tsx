"use client";
import { FC, useEffect } from "react";

export const Headless: FC = () => {
    useEffect(() => {
        miro.board.ui.on("icon:click", async () => {
            await miro.board.ui.openPanel({ url: "/panel" });
        });
    }, []);

    return <></>;
};
