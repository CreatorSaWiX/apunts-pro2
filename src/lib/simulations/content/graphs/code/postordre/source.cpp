void postordre(Node* node) {
    if (node == nullptr) return;
    postordre(node->left);
    postordre(node->right);
    cout << node->value << " ";
}