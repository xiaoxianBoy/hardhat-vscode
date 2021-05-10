import { UnaryOperation } from "@solidity-parser/parser/dist/src/ast-types";

import { Location, FinderType, Node, Position } from "./Node";

export class UnaryOperationNode implements Node {
    type: string;
    uri: string;
    astNode: UnaryOperation;

    nameLoc?: Location | undefined;

    expressionNode?: Node | undefined;

    connectionTypeRules: string[] = [];

    parent?: Node | undefined;
    children: Node[] = [];

    typeNodes: Node[] = [];

    constructor (unaryOperation: UnaryOperation, uri: string) {
        this.type = unaryOperation.type;
        this.uri = uri;
        this.astNode = unaryOperation;
    }

    getTypeNodes(): Node[] {
        return this.typeNodes;
    }

    addTypeNode(node: Node): void {
        this.typeNodes.push(node);
    }

    getExpressionNode(): Node | undefined {
        return this.expressionNode;
    }

    setExpressionNode(node: Node | undefined): void {
        this.expressionNode = node;
    }

    getDefinitionNode(): Node | undefined {
        // TO-DO: Method not implemented
        return undefined;
    }

    getName(): string | undefined {
        return undefined;
    }

    addChild(child: Node): void {
        this.children.push(child);
    }

    setParent(parent: Node | undefined): void {
        this.parent = parent;
    }

    getParent(): Node | undefined {
        return this.parent;
    }

    accept(find: FinderType, orphanNodes: Node[], parent?: Node, expression?: Node): Node {
        this.setExpressionNode(expression);

        find(this.astNode.subExpression, this.uri).accept(find, orphanNodes, parent);

        return this;
    }
}
