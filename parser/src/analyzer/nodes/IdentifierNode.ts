import { Identifier } from "@solidity-parser/parser/dist/src/ast-types";

import * as finder from "../finder";
import { Location, FinderType, Node, Position } from "./Node";

export class IdentifierNode implements Node {
    type: string;
    uri: string;
    astNode: Identifier;

    nameLoc?: Location | undefined;

    expressionNode?: Node | undefined;

    connectionTypeRules: string[] = [];

    parent?: Node | undefined;
    children: Node[] = [];

    typeNodes: Node[] = [];

    constructor (identifier: Identifier, uri: string) {
        this.type = identifier.type;
        this.uri = uri;
        
        if (identifier.loc) {
            // Bug in solidity parser doesn't give exact end location
            identifier.loc.end.column = identifier.loc.end.column + identifier.name.length;

            this.nameLoc = JSON.parse(JSON.stringify(identifier.loc));
        }

        this.astNode = identifier;
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
        return this.parent?.getDefinitionNode();
    }

    getName(): string | undefined {
        return this.astNode.name;
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

        if (parent) {
            const identifierParent = finder.findParent(this, parent);

            if (identifierParent) {
                this.setParent(identifierParent);
                identifierParent?.addChild(this);

                this.typeNodes.push(identifierParent);

                return this;
            }
        }

        orphanNodes.push(this);

        return this;
    }
}
