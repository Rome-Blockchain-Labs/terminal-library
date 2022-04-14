import { setSearchToken } from '../../redux/tokenSearchSlice';


// Function that validates if the user is searching for a token and changes the search string accordingly.
// We are also adding a value to say if the token search was enabled or not, that way if the user removes characters from the string outside of the threshold,
// we will revert to a non-token search.
//
// IMPORTANT: If the user is searching for a string, that is NOT a token but validates as one, the search WILL only be looking for a token.
//
export const mutatorTextToken = (input, searchToken, dispatch) => {
    // We want to tell the user whats going on by updating the value on the UI.
    // The user has to know that we will be looking only for tokens that start with the said string now.
    let value = input.value;
    const leadIsTokenLike = value.substr(0, 2).toLowerCase() === '0x';
    const valueIsTokenLike = new RegExp(/^[0-9a-f]+$/i).test(value.substr(leadIsTokenLike ? 2 : 0));
    const valueLength = value.length;


    // Checks that 'leadIsTokenLike' is false and that the value is token like.
    if (!leadIsTokenLike && valueIsTokenLike && valueLength >= 5) {
        // Add the leading '0x' to the value.
        value = '0x' + value;

        // User is looking for a token.
        dispatch(setSearchToken(true));
    }
    else
        // Checks if the search is looking for a token.
        if (searchToken)
            // Checks that the value lead is token like.
            if (leadIsTokenLike) {
                // Checks if the user has deleted characters from the search threshold for token detection.
                // We are looking for a lenght smaller than 7, since we have to take into account the leading '0x'.
                if (valueLength < 7) {
                    // Removes the leading '0x' from the value.
                    value = value.substr(2);

                    // User is NOT looking for a token.
                    dispatch(setSearchToken(false));
                }
                else
                    // We are checking if the value is token like; since the user may have added non-hex characters to the search string.
                    if (!valueIsTokenLike) {
                        // Removes the leading '0x' from the value.
                        value = value.substr(2);

                        // User is NOT looking for a token.
                        dispatch(setSearchToken(false));
                    }
            }
            // This should not happen.
            // Something went wrong, not sure how this case can happen, but we are turning off the token search.
            else
                // User is NOT looking for a token.
                dispatch(setSearchToken(false));

    // We update the input value if the string is not empty.
    if (!!value) input.value = value;


    // Returning.
    return value;
};