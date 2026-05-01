import { CategoriaModel } from "./categoria.model";

export interface ProdutoModel {
    id?: string;
    nome?: string;
    descricao?: string;
    preco?: number;
    imagem?: any;
    urlImagem?: string;
    categoriaDto?: CategoriaModel;
    categoriaId?: string;
    ativo?: boolean;
}
