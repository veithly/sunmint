module sunmint_core::panel {
    use std::string::{Self, String};
    use sui::event;

    public struct PanelToken has key, store {
        id: UID,
        owner: address,
        panel_id: String,
        tokens: u64,
        token_price_usd_cents: u64,
        daily_dividend_usd_cents: u64,
        bought_at_ms: u64,
    }

    public struct PanelTokensBought has copy, drop {
        token_id: ID,
        owner: address,
        tokens: u64,
        token_price_usd_cents: u64,
    }

    public entry fun buy(
        panel_id: vector<u8>,
        tokens: u64,
        token_price_usd_cents: u64,
        daily_dividend_usd_cents: u64,
        clock: &sui::clock::Clock,
        ctx: &mut TxContext,
    ) {
        let owner = tx_context::sender(ctx);
        let token = PanelToken {
            id: object::new(ctx),
            owner,
            panel_id: string::utf8(panel_id),
            tokens,
            token_price_usd_cents,
            daily_dividend_usd_cents,
            bought_at_ms: sui::clock::timestamp_ms(clock),
        };
        let token_id = object::id(&token);
        event::emit(PanelTokensBought { token_id, owner, tokens, token_price_usd_cents });
        transfer::public_transfer(token, owner);
    }
}
