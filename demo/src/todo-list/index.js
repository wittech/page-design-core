import React from "react";
import {
    WebDesignDndProvider,
    DropContainer,
    DropItem,
    DragLayer,
    getEmptyImage
} from "@/src";

/**
 * 自定义拖拽层
 * 禁用系统自带的拖拽层，使用用户自定义拖拽层
 */

const dataset = [];

for (let i = 0; i < 20; i++) {
    dataset.push({
        pid: "nostart",
        id: i + 1,
        title: `${i + 1}. item`
    });
}

function ListItem({ item }) {
    return (
        <DropItem item={item}>
            {({ connectDragAndDrop, connectDragPreview, isDragging }) => {
                //用空白图片覆盖默认推拽效果
                connectDragPreview(getEmptyImage());

                return (
                    <div
                        ref={connectDragAndDrop}
                        style={{
                            opacity: isDragging ? 0.4 : 1,
                            padding: 10,
                            margin: 5,
                            background: "#f2f2f2",
                            border: "1px solid #dadada"
                        }}
                    >
                        {item.title}
                    </div>
                );
            }}
        </DropItem>
    );
}

function ItemDragLayer({ dom, differenceFromInitialOffset }) {
    const [ret, initData] = React.useState(null);

    React.useEffect(() => {
        const cloneNode = dom.cloneNode(true);
        const rect = dom.getBoundingClientRect();

        initData({
            rect,
            cloneNode
        });

        cloneNode.style.position = "fixed";
        //重要
        cloneNode.style.pointerEvents = "none";
        cloneNode.style.opacity = 1;
        cloneNode.style.left = rect.left + "px";
        cloneNode.style.top = rect.top + "px";
        cloneNode.style.boxSizing = "border-box";
        cloneNode.style.width = rect.width + "px";
        cloneNode.style.height = rect.height + "px";

        document.body.appendChild(cloneNode);
        return () => {
            document.body.removeChild(cloneNode);
        };
    }, [dom]);

    if (ret) {
        const { cloneNode, rect } = ret;
        if (differenceFromInitialOffset) {
            cloneNode.style.left =
                rect.left + differenceFromInitialOffset.x + "px";
            cloneNode.style.top =
                rect.top + differenceFromInitialOffset.y + "px";
        }
    }

    return null;
}

export default () => {
    const [value, onChange] = React.useState(dataset);

    return (
        <WebDesignDndProvider value={value} onChange={onChange}>
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    margin: "30px auto",
                    height: "80%",
                    width: 800
                }}
            >
                <DropContainer pid="nostart">
                    {({ items, monitor, canDrop, connectDropTarget }) => (
                        <div
                            style={{
                                flex: "1",
                                border: "1px solid #ccc",
                                borderRadius: 4,
                                padding: 5,
                                overflow: "auto",
                                display: "flex",
                                flexDirection: "column"
                            }}
                        >
                            <div>未开始</div>
                            <div
                                ref={connectDropTarget}
                                style={{
                                    flex: "1"
                                }}
                            >
                                {items.map(item => (
                                    <ListItem key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    )}
                </DropContainer>
                <div
                    style={{
                        width: 20
                    }}
                ></div>
                <DropContainer pid="pending">
                    {({ items, monitor, canDrop, connectDropTarget }) => (
                        <div
                            style={{
                                flex: "1",
                                border: "1px solid #ccc",
                                borderRadius: 4,
                                padding: 5,
                                overflow: "auto",
                                display: "flex",
                                flexDirection: "column"
                            }}
                        >
                            <div>处理中</div>
                            <div
                                ref={connectDropTarget}
                                style={{
                                    flex: "1",
                                    backgroundColor: canDrop ? "#eef9f3" : ""
                                }}
                            >
                                {items.map(item => (
                                    <ListItem key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    )}
                </DropContainer>
                <div
                    style={{
                        width: 20
                    }}
                ></div>
                <DropContainer pid="done">
                    {({ items, monitor, canDrop, connectDropTarget }) => (
                        <div
                            style={{
                                flex: "1",
                                border: "1px solid #ccc",
                                borderRadius: 4,
                                padding: 5,
                                overflow: "auto",
                                display: "flex",
                                flexDirection: "column"
                            }}
                        >
                            <div>已完成</div>
                            <div
                                ref={connectDropTarget}
                                style={{
                                    flex: "1",
                                    backgroundColor: canDrop ? "#eef9f3" : ""
                                }}
                            >
                                {items.map(item => (
                                    <ListItem key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    )}
                </DropContainer>
                <DragLayer>
                    {({ isDragging, dom, ...props }) => {
                        if (!isDragging || !dom) return null;
                        return <ItemDragLayer dom={dom} {...props} />;
                    }}
                </DragLayer>
            </div>
        </WebDesignDndProvider>
    );
};
