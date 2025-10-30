import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";

persistent actor IdeaWall {
  transient let natMap = OrderedMap.Make<Text>(Text.compare);

  var cards = natMap.empty<Card>();

  type Card = {
    id :Text;
    content : Text;
    x : Int;
    y : Int;
    created : Int;
  };

  public func createCard(id:Text,content : Text, x : Int, y : Int) : async Text {
  

    let card : Card = {
      id;
      content;
      x;
      y;
      created = Time.now();
    };

    cards := natMap.put(cards, id, card);
    id;
  };

  public func updateCardPosition(id : Text, x : Int, y : Int) : async Bool {
    switch (natMap.get(cards, id)) {
      case (null) { false };
      case (?card) {
        let updatedCard : Card = {
          id = card.id;
          content = card.content;
          x;
          y;
          created = card.created;
        };
        cards := natMap.put(cards, id, updatedCard);
        true;
      };
    };
  };

  public func getAllCards() : async [Card] {
    Iter.toArray(natMap.vals(cards));
  };

  public func deleteCard(id : Text) : async Bool {
    let (newCards, removedCard) = natMap.remove(cards, id);
    cards := newCards;
    switch (removedCard) {
      case (null) { false };
      case (?_) { true };
    };
  };
};
