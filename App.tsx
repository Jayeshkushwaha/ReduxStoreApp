import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Modal, Button, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './src/redux/store';
import { addToCart, incrementQuantity, decrementQuantity } from './src/redux/actions';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);

    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setProducts(data))
            .catch(error => console.error('Fetch error:', error));
    }, []);

    const openModal = (product) => {
        setSelectedProduct(product);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const addToCartHandler = () => {
        const productInCart = cart.find(item => item.id === selectedProduct.id);
        if (productInCart) {
            dispatch(incrementQuantity(selectedProduct.id));
        } else {
            dispatch(addToCart({ ...selectedProduct, quantity: 1 }));
        }
        closeModal();
    };

    const incrementHandler = (id) => {
        dispatch(incrementQuantity(id));
    };

    const decrementHandler = (id) => {
        const productInCart = cart.find(item => item.id === id);
        if (productInCart.quantity === 1) {
            dispatch(decrementQuantity(id)); // This will remove the product from the cart
        } else if (productInCart.quantity > 1) {
            dispatch(decrementQuantity(id));
        }
    };

    const renderItem = ({ item }) => {
        const productInCart = cart.find(cartItem => cartItem.id === item.id);

        return (
            <TouchableOpacity style={styles.itemContainer} onPress={() => openModal(item)}>
                <View style={styles.itemContent}>
                    <Image resizeMode='contain' source={{ uri: item.image }} style={styles.image} />
                    <View style={styles.itemTextContainer}>
                        <Text style={styles.itemText}>{item.title}</Text>
                        <Text style={styles.itemPrice}>${item.price}</Text>
                    </View>
                </View>

                {productInCart && productInCart.quantity > 0 && (
                    <View style={styles.cartActions}>
                        <TouchableOpacity onPress={() => decrementHandler(item.id)} style={styles.cartButton}>
                            <Text style={styles.cartButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{productInCart.quantity}</Text>
                        <TouchableOpacity onPress={() => incrementHandler(item.id)} style={styles.cartButton}>
                            <Text style={styles.cartButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Shopping</Text>
            </View>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
            {selectedProduct && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{selectedProduct.title}</Text>
                            <Image resizeMode='contain' source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                            <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
                            <Text style={styles.modalPrice}>${selectedProduct.price}</Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.addButton} onPress={addToCartHandler}>
                                    <Text style={styles.addButtonText}>Add to Cart</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.addButton} onPress={closeModal}>
                                    <Text style={styles.addButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
};

const App = () => {
    return (
        <Provider store={store}>
            <ProductList />
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#007bff',
    },
    headerText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    itemContainer: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#dee2e6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    itemText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#343a40',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '400',
        color: '#6c757d',
        marginTop: 5,
    },
    cartActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartButton: {
        backgroundColor: '#ced4da',
        padding: 8,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    cartButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#495057',
    },
    quantityText: {
        fontSize: 18,
        color: '#495057',
        marginHorizontal: 10,
    },
    addButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalDescription: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
        color: '#495057',
    },
    modalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 20,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 5,
    },
    modalImage: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default App;
